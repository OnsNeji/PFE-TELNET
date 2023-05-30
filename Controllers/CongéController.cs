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
using PdfSharpCore;
using PdfSharpCore.Pdf;
using TheArtOfDev.HtmlRenderer.PdfSharp;
using System.IO;

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

            // Récupérer l'utilisateur correspondant à la demande de congé
            Utilisateur utilisateur = await _context.Utilisateurs.FindAsync(congé.UtilisateurId);

            if (congé.Type == "Congé de maternité")
            {
                // Autoriser la demande de congé de maternité sans vérification
                _context.Congés.Add(congé);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCongé), new { id = congé.id }, congé);
            }
            else
            {
                // Vérifier si l'utilisateur a suffisamment de jours de congés disponibles
                if (congé.Duree <= utilisateur.JoursCongé)
                {
                    _context.Congés.Add(congé);
                    await _context.SaveChangesAsync();
                    return CreatedAtAction(nameof(GetCongé), new { id = congé.id }, congé);
                }
                else
                {
                    // L'utilisateur n'a pas suffisamment de jours de congés disponibles
                    return BadRequest("Nombre de jours de congés insuffisant.");
                }
            }
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> ApprouverCongé(int id)
        {
            var congé = await _context.Congés.FindAsync(id);
            if (congé == null)
            {
                return NotFound();
            }
                congé.Status = "Approuvé";

                var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == congé.UtilisateurId && u.Supprimé == false);

                if (utilisateur != null)
                {
                // Mettre à jour le nombre de jours de congés disponibles de l'utilisateur
                utilisateur.JoursCongé -= congé.Duree;

                _context.Entry(utilisateur).State = EntityState.Modified; // Update the utilisateur entity in the context
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

            var document = new PdfDocument();
            DateTime dateApprobation = DateTime.Now;
            if (congé.Type == "Congé de maternité")
            {
                string htmlContent = $"<html><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><h1 style='text-align: center; margin-top: 2%;'> {congé.Type} </h1><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Nous avons le plaisir de vous informer, Mme <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong>, que votre demande de congé de maternité a été approuvée par notre équipe de gestion des ressources humaines. Nous comprenons l'importance de cette période de transition dans votre vie et nous sommes heureux de pouvoir vous accorder le congé nécessaire pour vous préparer à l'arrivée de votre enfant.</p><p style='width: 100%; margin-left: 5%; line-height: 1.5;'>Voici les détails de votre congé :<ul><li>Dates de congé : {congé.DateDebut.ToString("dd/MM/yyyy")}</li><li>Durée du congé : {congé.Duree} Jours</li><li>Type de congé : {congé.Type} rémunéré</li><li>Raison du congé : Naissance imminente de votre enfant</li></ul></p><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Pendant votre absence, nous vous prions de vous assurer que toutes les tâches en cours sont correctement gérées et que vous avez pris les dispositions nécessaires pour transmettre les responsabilités à un collègue. Si vous avez besoin d'une assistance supplémentaire pour faciliter la transition, veuillez en informer votre supérieur hiérarchique afin que nous puissions prendre les mesures appropriées.<br><br>Nous vous rappelons que vous êtes éligible à bénéficier des prestations de congé de maternité conformément à la législation en vigueur. Nous vous encourageons à vous familiariser avec les démarches administratives et les formulaires nécessaires pour recevoir les prestations auxquelles vous avez droit.<br><br>Si vous avez des questions ou des préoccupations supplémentaires concernant votre congé de maternité, n'hésitez pas à contacter votre supérieur hiérarchique ou le service des ressources humaines.<br><br>Nous vous souhaitons une grossesse heureuse et épanouissante. Profitez pleinement de cette période de préparation à l'arrivée de votre enfant. Votre bien-être et celui de votre bébé sont importants pour nous, et nous sommes convaincus que vous reviendrez au travail avec de nouvelles énergies après votre congé de maternité.</p><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{dateApprobation.ToString("dd/MM/yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>"; 
                PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
            }
            else if (congé.Type == "Congé de maladie")
            {
                string htmlContent = $"<html><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><h1 style='text-align: center; margin-top: 2%;'> {congé.Type} </h1><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Nous avons le plaisir de vous informer, Mr/Mme <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong>, que votre demande de congé de maladie a été approuvée par notre équipe de gestion des ressources humaines. Nous comprenons l'importance de prendre soin de votre santé et nous sommes là pour vous soutenir pendant cette période difficile.</p><p style='width: 100%; margin-left: 5%; line-height: 1.5;'>Voici les détails de votre congé :<ul><li>Dates de congé : {congé.DateDebut.ToString("dd/MM/yyyy")}</li><li>Durée du congé : {congé.Duree} Jours</li><li>Type de congé : {congé.Type} rémunéré</li><li>Raison du congé : Maladie</li></ul></p><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Pendant votre absence, nous vous prions de vous concentrer sur votre rétablissement et de suivre les recommandations de votre professionnel de santé. Il est important que vous preniez le temps nécessaire pour récupérer pleinement et revenir en bonne santé.<br><br>Veuillez nous informer de l'évolution de votre état de santé et fournir les certificats médicaux requis pour justifier votre absence, conformément à notre politique interne.<br><br>Si vous avez besoin d'une assistance supplémentaire ou de ressources pour faciliter votre rétablissement, veuillez contacter le service des ressources humaines. Nous sommes là pour vous soutenir et vous aider dans la mesure du possible.<br><br>Nous vous rappelons que vos avantages liés à la maladie, tels que les congés payés et les prestations d'assurance maladie, s'appliqueront pendant votre congé de maladie conformément à notre politique interne et aux lois en vigueur.<br><br>Nous vous souhaitons un prompt rétablissement et espérons vous revoir en bonne santé bientôt.</p><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{congé.Date.ToString("dd/MM/yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>";
                PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
            }
            else if (congé.Type == "Congé pour soins familiaux")
            {
                string htmlContent = $"<html><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><h1 style='text-align: center; margin-top: 2%;'> {congé.Type} </h1><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Nous avons le plaisir de vous informer, Mr/Mme <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong>, que votre demande de congé pour soins familiaux a été approuvée par notre équipe de gestion des ressources humaines. Nous comprenons l'importance de prendre soin de vos proches et nous sommes là pour vous soutenir pendant cette période.</p><p style='width: 100%; margin-left: 5%; line-height: 1.5;'>Voici les détails de votre congé :<ul><li>Dates de congé : {congé.DateDebut.ToString("dd/MM/yyyy")}</li><li>Durée du congé : {congé.Duree} Jours</li><li>Type de congé : {congé.Type} rémunéré</li><li>Raison du congé : Maladie</li></ul></p><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Pendant votre absence, nous vous prions de vous concentrer sur les besoins de votre proche et de fournir le soutien nécessaire. Veillez à prendre les dispositions nécessaires pour assurer la continuité des tâches et informer votre supérieur hiérarchique afin que des mesures appropriées puissent être prises pour gérer votre charge de travail.<br><br>Veuillez noter que le congé pour soins familiaux est soumis à certaines conditions et exigences légales. Nous vous encourageons à vous familiariser avec nos politiques internes et à fournir les documents requis pour justifier votre absence.<br><br>Si vous avez besoin d'une assistance supplémentaire ou de ressources pour faciliter votre rôle de soignant, veuillez contacter le service des ressources humaines. Nous sommes là pour vous soutenir et vous aider dans la mesure du possible.<br><br>Nous vous rappelons que vos avantages liés au congé pour soins familiaux, tels que les congés payés et les prestations d'assurance, s'appliqueront pendant votre absence conformément à notre politique interne et aux lois en vigueur.<br><br>Nous vous remercions pour votre dévouement envers votre famille et nous espérons que cette période vous permettra de prendre soin de vos proches de manière appropriée. Votre bien-être et celui de votre famille sont importants pour nous.</p><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{dateApprobation.ToString("dd/MM/yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>";
                PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
            }
            else if (congé.Type == "Congé de deuil")
            {
                string htmlContent = $"<html><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><h1 style='text-align: center; margin-top: 2%;'> {congé.Type} </h1><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Nous avons le regret de vous informer, Mr/Mme <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong>, que votre demande de congé de deuil a été approuvée par notre équipe de gestion des ressources humaines. Nous comprenons l'importance de ce moment difficile pour vous et nous sommes là pour vous soutenir pendant cette période de deuil.</p><p style='width: 100%; margin-left: 5%; line-height: 1.5;'>Voici les détails de votre congé :<ul><li>Dates de congé : {congé.DateDebut.ToString("dd/MM/yyyy")}</li><li>Durée du congé : {congé.Duree} Jours</li><li>Type de congé : {congé.Type} rémunéré</li><li>Raison du congé : Décès d'un être cher</li></ul></p><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Nous vous prions d'accepter nos sincères condoléances pour votre perte. Nous comprenons que cette période peut être émotionnellement difficile, et nous vous encourageons à prendre le temps nécessaire pour vous recueillir, vous entourer de vos proches et faire votre deuil.<br><br>Pendant votre absence, nous vous prions de vous assurer que toutes les tâches en cours sont correctement gérées et que vous avez pris les dispositions nécessaires pour transmettre les responsabilités à un collègue. Si vous avez besoin d'une assistance supplémentaire pour faciliter la transition, veuillez en informer votre supérieur hiérarchique afin que nous puissions prendre les mesures appropriées.Nous vous rappelons que vous avez droit à des prestations de congé de deuil conformément à notre politique interne. Veuillez prendre connaissance des démarches administratives et des formulaires requis pour bénéficier de ces prestations.<br><br>Nous vous souhaitons beaucoup de courage et de réconfort pendant cette période difficile. Prenez soin de vous et de votre bien-être. Nous sommes là pour vous soutenir.</p><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{dateApprobation.ToString("dd/MM/yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>"; 
                PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
            }
            byte[]? response = null;
            using (MemoryStream ms = new MemoryStream())
            {
                document.Save(ms);
                response = ms.ToArray();
            }
            string base64String = Convert.ToBase64String(response);
            // Assign the generated PDF byte array to the Document property
            congé.Document = "data:application/pdf;base64," + base64String;
            _context.SaveChanges();
            string Filename = "Invoice.pdf";
            return File(response, "application/pdf", Filename);

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
