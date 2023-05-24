using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit.Text;
using MimeKit;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;
using Microsoft.Extensions.Configuration;

namespace TelnetTeamBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MariageNaissanceController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        public MariageNaissanceController(AppDbContext appDbContext, IConfiguration configuration)
        {
            _context = appDbContext;
            _config = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MariageNaissance>>> GetMariageNaissances()
        {
            return await _context.MariageNaissances.Include(m => m.Utilisateur).Where(m => m.Utilisateur.Supprimé == false).ToListAsync();
                       
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MariageNaissance>> GetMariageNaissance(int id)
        {
            var mariageNaissance = await _context.MariageNaissances.FindAsync(id);

            if (mariageNaissance == null)
            {
                return NotFound();
            }

            return mariageNaissance;
        }

        [HttpPost]
        public async Task<ActionResult<MariageNaissance>> PostMariageNaissance(MariageNaissance mariageNaissance)
        {
            _context.MariageNaissances.Add(mariageNaissance);
            await _context.SaveChangesAsync();

            string contenuEmail;
            var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == mariageNaissance.UtilisateurId && u.Supprimé == false);

            if (utilisateur != null)
            {
                // Composer et envoyer le message
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                message.To.Add(new MailboxAddress($"{utilisateur.Prenom} {utilisateur.Nom}", utilisateur.Email));
                
                if (mariageNaissance.Titre == "Mariage")
                {
                    if (string.IsNullOrEmpty(mariageNaissance.Email))
                    {
                        contenuEmail = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Félicitations sincères pour votre mariage !</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Cher/Chère {utilisateur.Nom} {utilisateur.Prenom},</p><p>Nous tenons à vous adresser nos plus chaleureuses félicitations pour votre mariage ! C'est avec une grande joie que nous avons appris cette merveilleuse nouvelle, et nous tenons à prendre le temps de vous exprimer nos vœux les plus sincères.</p><p style=\"margin-bottom:25px;\">Que ce grand jour marque le début d'une grande et belle aventure pour vous deux.</p></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>";
                    }
                    else
                    {
                        contenuEmail = mariageNaissance.Email;
                    }

                    message.Subject = "Félicitations sincères pour votre mariage !";
                    message.Body = new TextPart(TextFormat.Html)
                    {

                        Text = contenuEmail
                    };
                } else if (mariageNaissance.Titre == "Naissance")
                {
                    if (string.IsNullOrEmpty(mariageNaissance.Email))
                    {
                        contenuEmail = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Félicitations pour la naissance de votre bébé !</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Cher/Chère {utilisateur.Nom} {utilisateur.Prenom},</p><p>Nous tenons à vous adresser nos plus sincères félicitations pour la naissance de votre précieux bébé ! C'est avec une immense joie que nous avons appris cette merveilleuse nouvelle, et nous voulons prendre un moment pour partager avec vous cette occasion spéciale.</p><p style=\"margin-bottom:25px;\">Que cette nouvelle étape de votre vie soit une source d'inspiration et de joie, tant sur le plan personnel que professionnel.</p></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>";
                    }
                    else
                    {
                        contenuEmail = mariageNaissance.Email;
                    }
                    message.Subject = "Félicitations pour la naissance de votre bébé !";
                    message.Body = new TextPart(TextFormat.Html)
                    {
                        Text = contenuEmail
                    };
                }

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


            return CreatedAtAction(nameof(GetMariageNaissance), new { id = mariageNaissance.id }, mariageNaissance);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMariageNaissance(int id, [FromBody] MariageNaissance mariageNaissance)
        {
            if (id != mariageNaissance.id)
            {
                return BadRequest();
            }

            _context.Entry(mariageNaissance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MariageNaissanceExists(id))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMariageNaissance(int id)
        {
            var mariageNaissance = await _context.MariageNaissances.FindAsync(id);
            if (mariageNaissance == null)
            {
                return NotFound();
            }

            _context.MariageNaissances.Remove(mariageNaissance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MariageNaissanceExists(int id)
        {
            return _context.MariageNaissances.Any(e => e.id == id);
        }
    }
}
