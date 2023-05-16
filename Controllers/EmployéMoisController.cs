using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;

namespace TelnetTeamBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployéMoisController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public EmployéMoisController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _config = configuration;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployéMois>>> GetEmployéMois()
        {
            return await _context.EmployéMois.Include(m => m.Utilisateur).Where(m => m.Utilisateur.Supprimé == false).ToListAsync();
        }

        // GET: api/EmployéMois/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployéMois>> GetEmployéMois(int id)
        {
            var employéMois = await _context.EmployéMois.FindAsync(id);

            if (employéMois == null)
            {
                return NotFound();
            }

            return employéMois;
        }

        // POST: api/EmployéMois
        [HttpPost]
        public async Task<ActionResult<EmployéMois>> PostEmployéMois(EmployéMois employéMois)
        {
            _context.EmployéMois.Add(employéMois);
            // Add notification
            Notification notification = new Notification
            {
                Message = "Nouvel employé du mois ajouté",
                Date = DateTime.Now,
                UserAjout = employéMois.UserAjout,
                EmployéMois = employéMois
            };
            _context.notifications.Add(notification);
            await _context.SaveChangesAsync();


            var users = await _context.Utilisateurs.Where(u => u.Supprimé == false).ToListAsync();
            foreach (var user in users)
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                message.To.Add(new MailboxAddress($"{user.Prenom} {user.Nom}", user.Email));
                message.Subject = "Nouvel employé du mois ajouté";
                message.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Nouvel employé du mois ajouté</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {user.Nom} {user.Prenom},</p><p>Nous sommes heureux de vous informer qu'un nouvel employé du mois a été ajouté.</p><p style=\"margin-bottom:25px;\">Veuillez noter que toutes les informations concernant le nouveau employé du mois sont disponibles sur site.</p><a href=\"http://localhost:4200/accueil\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
                };


                using (var client = new SmtpClient())
                {
                    try
                    {
                        client.Connect(_config["EmailSettings:SmtpServer"], 465, true);
                        client.Authenticate(_config["EmailSettings:From"], _config["EmailSettings:Password"]);
                        client.Send(message);

                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                    finally
                    {
                        client.Disconnect(true);
                        client.Dispose();
                    }
                }
            }

            return CreatedAtAction(nameof(GetEmployéMois), new { id = employéMois.id }, employéMois);
        }

        // PUT: api/EmployéMois/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployéMois(int id, [FromBody] EmployéMois employéMois)
        {
            if (id != employéMois.id)
            {
                return BadRequest("L'identifiant de l'employé ne correspond pas à l'identifiant de la requête.");
            }

            _context.Entry(employéMois).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployéMoisExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/EmployéMois/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployéMois(int id)
        {
            var employéMois = await _context.EmployéMois.FindAsync(id);
            if (employéMois == null)
            {
                return NotFound();
            }
            var notification = await _context.notifications.FirstOrDefaultAsync(n => n.EmployéMoisId == id);
            if (notification != null)
            {
                _context.notifications.Remove(notification);
                await _context.SaveChangesAsync();
            }
            _context.EmployéMois.Remove(employéMois);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployéMoisExists(int id)
        {
            return _context.EmployéMois.Any(e => e.id == id);
        }

    }
}