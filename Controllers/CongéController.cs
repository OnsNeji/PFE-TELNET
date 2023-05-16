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
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace TelnetTeamBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CongéController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public CongéController(AppDbContext appDbContext, IConfiguration configuration)
        {
            _context = appDbContext;
            _config = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Congé>>> GetCongés()
        {
            return await _context.Congés.Include(m => m.Utilisateur).Where(m => m.Utilisateur.Supprimé == false).OrderByDescending(m => m.Status == "En attente").ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Congé>> GetCongé(int id)
        {
            var congé = await _context.Congés.FindAsync(id);

            if (congé == null)
            {
                return NotFound();
            }

            return congé;
        }

        [HttpGet("CongéParUtilisateur/{id}")]
        public async Task<ActionResult<IEnumerable<Congé>>> GetCongésByUtilisateur(int id)
        {
            var congés = await _context.Congés.Include(d => d.Utilisateur).Where(d => d.UtilisateurId == id).ToListAsync();

            if (congés == null)
            {
                return NotFound();
            }

            return congés;
        }

        [HttpPost]
        public async Task<ActionResult<Congé>> PostCongé(Congé congé)
        {
            congé.Status = "En attente";
            congé.Date = DateTime.Now;
            _context.Congés.Add(congé);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCongé), new { id = congé.id }, congé);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCongé(int id, [FromBody] Congé congé)
        {
            if (id != congé.id)
            {
                return BadRequest();
            }

            if (string.IsNullOrEmpty(congé.Document))
            {
                congé.Status = "En attente";
            }
            else
            {
                congé.Status = "Approuvé";

                var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == congé.UtilisateurId && u.Supprimé == false);

                if (utilisateur != null)
                {
                    // Composer et envoyer le message
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                    message.To.Add(new MailboxAddress($"{utilisateur.Prenom} {utilisateur.Nom}", utilisateur.Email));
                    message.Subject = "Demande de congé approuvée";
                    message.Body = new TextPart(TextFormat.Html)
                    {
                        Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Demande de congé approuvée</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {utilisateur.Nom} {utilisateur.Prenom},</p><p>Nous sommes heureux de vous informer que votre demande de <strong>{congé.Type}</strong> a été approuvée.</p><p style=\"margin-bottom:25px;\">Veuillez noter que votre document approuvé est disponible sur site.</p><a href=\"http://localhost:4200/login\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
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
            }

            _context.Entry(congé).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CongéExists(id))
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

        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectCongé(int id)
        {
            var congé = await _context.Congés.FindAsync(id);

            if (congé == null)
            {
                return NotFound();
            }

            congé.Status = "Rejeté";
            congé.Document = null;

            var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == congé.UtilisateurId && u.Supprimé == false);

            if (utilisateur != null)
            {
                // Composer et envoyer le message
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                message.To.Add(new MailboxAddress($"{utilisateur.Prenom} {utilisateur.Nom}", utilisateur.Email));
                message.Subject = "Demande de congé rejetée";
                message.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Demande de congé rejetée</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {utilisateur.Nom} {utilisateur.Prenom},</p><p>Nous sommes au regret de vous informer que votre demande de <strong>{congé.Type}</strong> a été rejetée.</p><p style=\"margin-bottom:25px;\">Veuillez noter que toutes les informations sont disponibles sur site.</p><a href=\"http://localhost:4200/login\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
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

            _context.Entry(congé).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CongéExists(id))
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
        public async Task<IActionResult> DeleteCongé(int id)
        {
            var congé = await _context.Congés.FindAsync(id);
            if (congé == null)
            {
                return NotFound();
            }

            _context.Congés.Remove(congé);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CongéExists(int id)
        {
            return _context.Congés.Any(e => e.id == id);
        }

        // GET: api/Congé/stats/count
        [HttpGet("stats/count")]
        public IActionResult GetCongéCount()
        {
            var count = _context.Congés.Count();
            return Ok(count);
        }

        // GET: api/Congé/stats/status
        [HttpGet("stats/status")]
        public IActionResult GetCongéByStatus()
        {
            // Get the count of each status
            var statusCounts = _context.Congés
                .GroupBy(d => d.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToList();

            return Ok(statusCounts);
        }

        // GET: api/Congé/stats/titre
        [HttpGet("stats/type")]
        public IActionResult GetCongésByType()
        {
            var congésByType = _context.Congés
                .GroupBy(d => d.Type)
                .Select(g => new { Type = g.Key, Count = g.Count() })
                .ToList();

            return Ok(congésByType);
        }

    }
}
