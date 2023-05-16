using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TelnetTeamBack.Context;
using TelnetTeamBack.Helpers;
using TelnetTeamBack.models;
using TelnetTeamBack.models.Dto;
using TelnetTeamBack.UtilitéService;

namespace TelnetTeamBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowOrigin")]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public LoginController(AppDbContext appDbContext, IConfiguration configuration, IEmailService emailService)
        {
            _authContext = appDbContext;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] Utilisateur utilisateurObj)
        {
            if (utilisateurObj == null)
                return BadRequest();

            var utilisateur = await _authContext.Utilisateurs.FirstOrDefaultAsync(x => x.Matricule == utilisateurObj.Matricule);

            if (utilisateur == null)
                return NotFound(new { Message = "User Not Found" });

            if (!VerifyPassword(utilisateur.MotDePasse, utilisateurObj.MotDePasse))
                return Unauthorized(new { Message = "Invalid Password" });

            utilisateur.Token = CreateJwt(utilisateur);


            await _authContext.Connections.AddAsync(new Connection
            {
                utilisateurId = utilisateur.id,
                SignalrId = "test",
                ConnectedAt = DateTime.Now
            });

            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                Token = utilisateur.Token,
                Message = "Login Success!"
            });
        }

        private bool VerifyPassword(string hashedPassword, string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            var builder = new StringBuilder();
            foreach (var b in bytes)
            {
                builder.Append(b.ToString("x2"));
            }
            return builder.ToString() == hashedPassword;
        }

        private string CreateJwt(Utilisateur utilisateur)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysceret.....");
            var identity = new ClaimsIdentity(new Claim[]{
                   new Claim(ClaimTypes.NameIdentifier, $"{utilisateur.id}"),
                new Claim(ClaimTypes.Name, utilisateur.Nom + " " + utilisateur.Prenom),
                new Claim(ClaimTypes.Role, utilisateur.Role),
                new Claim(ClaimTypes.Surname, utilisateur.Matricule),
                new Claim(ClaimTypes.MobilePhone, utilisateur.Tel),
                new Claim(ClaimTypes.Email, utilisateur.Email),
                new Claim(ClaimTypes.Gender, utilisateur.Sexe),
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

        [HttpPost("send-reset-email/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var utilisateur = await _authContext.Utilisateurs.FirstOrDefaultAsync(a => a.Email == email);
            if (utilisateur is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Email introuvable"
                });
            }
            byte[] tokenBytes = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(tokenBytes);
            }
            string emailToken = Convert.ToBase64String(tokenBytes);
            utilisateur.ResetPasswordToken = emailToken;
            utilisateur.ResetPasswordExpiry = DateTime.Now.AddMinutes(15);
            string from = _configuration["EmailSettings:From"];
            string subject = "Réinitialisation de mot de passe";
            var emailModel = new EmailModel(email, subject, EmailBody.EmailStringBody(utilisateur.Nom + ' ' + utilisateur.Prenom, email, emailToken));
            _emailService.SendEmail(emailModel);
            _authContext.Entry(utilisateur).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email !"
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            var utilisateur = await _authContext.Utilisateurs.FirstOrDefaultAsync(a => a.Email == resetPasswordDto.Email);

            if (utilisateur is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Utilisateur introuvable"
                });
            }
            var tokenCode = utilisateur.ResetPasswordToken;
            DateTime emailTokenExpiry = utilisateur.ResetPasswordExpiry;
            if (tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.Now)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Lien invalide"
                });
            }
            utilisateur.MotDePasse = CryptoHelper.HashPassword(resetPasswordDto.NewPassword);
            _authContext.Entry(utilisateur).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Votre mot de passe a été modifié "
            });
        }

        [HttpGet("getProfile/{id}")]
        public IActionResult GetProfile(int id)
        {
            // Get the user from the database
            var user = _authContext.Utilisateurs.FirstOrDefault(u => u.id == id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("editProfile/{id}")]
        public IActionResult EditProfile(int id, [FromBody] Utilisateur updatedUser)
        {
            // Get the user from the database
            var user = _authContext.Utilisateurs.FirstOrDefault(u => u.id == id);

            if (user == null)
            {
                return NotFound();
            }

            // Update the user's properties with the new information
            user.Nom = updatedUser.Nom;
            user.Prenom = updatedUser.Prenom;
            user.Matricule = updatedUser.Matricule;
            user.Email = updatedUser.Email;
            user.MotDePasse = updatedUser.MotDePasse;
            user.Tel = updatedUser.Tel;
            user.Image = updatedUser.Image;

            try
            {
                // Save the changes to the database
                _authContext.SaveChanges();
            }
            catch (Exception)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        [HttpPost("changerPassword/{id}")]
        public async Task<IActionResult> ChangerPassword(int id, changerPasswordDto changerPasswordDto)
        {
            Utilisateur utilisateur = await _authContext.Utilisateurs.FindAsync(id);
            if (utilisateur == null)
            {
                return NotFound();
            }

            utilisateur.MotDePasse = CryptoHelper.HashPassword(changerPasswordDto.NouveauMotDePasse);

            _authContext.Entry(utilisateur).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Votre mot de passe a été modifié "
            });
        }

        private bool UserExists(int id)
        {
            return _authContext.Utilisateurs.Any(e => e.id == id);
        }
    }
}