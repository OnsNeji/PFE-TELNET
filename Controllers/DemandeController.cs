using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace TelnetTeamBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DemandeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public DemandeController(AppDbContext appDbContext, IConfiguration configuration)
        {
            _context = appDbContext;
            _config = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Demande>>> GetDemandes()
        {
            var demandes = await _context.Demandes
                .Include(m => m.Utilisateur)
                .Where(m => m.Utilisateur.Supprimé == false)
                .ToListAsync();

            return demandes;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Demande>> GetDemande(int id)
        {
            var demande = await _context.Demandes.FindAsync(id);

            if (demande == null)
            {
                return NotFound();
            }

            return demande;
        }

        [HttpGet("admin")]
        public async Task<ActionResult<IEnumerable<Demande>>> GetDemandesAdmin()
        {
            var demandes = await _context.Demandes
                .Include(m => m.Utilisateur)
                .Where(m => m.Utilisateur.Supprimé == false)
                .Where(m => m.Status != "Draft")
                .ToListAsync();

            return demandes;
        }


        [HttpGet("DemandeParUtilisateur/{id}")]
        public async Task<ActionResult<IEnumerable<Demande>>> GetDemandesByUtilisateur(int id)
        {
            var demandes = await _context.Demandes.Include(d => d.Utilisateur).Where(d => d.UtilisateurId == id).ToListAsync();

            if (demandes == null)
            {
                return NotFound();
            }

            return demandes;
        }

        [HttpPost]
        public async Task<ActionResult<Demande>> PostDemande(Demande demande)
        {
            demande.Status = "Draft";
            demande.Date = DateTime.Now;
            if (demande.Titre == "Fiche de paie" || demande.Titre == "Attestation de travail" || demande.Titre == "Lettre de recommandation" || demande.Titre == "Certificat d'impôts" || demande.Titre == "Assurance" || demande.Titre == "Attestation de salaire")
            {
                demande.DateSortie = null;
            }
            else if (demande.Titre == "Autorisation de sortie" || demande.Titre == "Attestation de travail" || demande.Titre == "Lettre de recommandation" || demande.Titre == "Assurance" || demande.Titre == "Attestation de salaire")
            {
                demande.Mois = null;
            }
            else if (demande.Titre == "Autorisation de sortie" || demande.Titre == "Attestation de travail" || demande.Titre == "Lettre de recommandation" || demande.Titre == "Certificat d'impôts" || demande.Titre == "Assurance" || demande.Titre == "Fiche de paie")
            {
                demande.DateDebut = null;
                demande.DateSortie = null;
            }

            _context.Demandes.Add(demande);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDemande), new { id = demande.id }, demande);

        }

        [HttpPost("new/{id}")]
        public async Task<IActionResult> CreateDemande(int id)
        {
            // Récupérez la demande existante à partir de l'ID
            var demande = await _context.Demandes.FindAsync(id);
            if (demande == null)
            {
                return NotFound();
            }

            // Créez une nouvelle demande avec le statut "emis"
            var nouvelleDemande = new Demande
            {
                // Copiez les propriétés de la demande existante
                Titre = demande.Titre,
                Description = demande.Description,
                Priorite = demande.Priorite,
                Date = DateTime.Now,
                Document = demande.Document,
                Mois = demande.Mois,
                Motif = demande.Motif,
                Destinataire = demande.Destinataire,
                DateSortie = demande.DateSortie,
                UtilisateurId = demande.UtilisateurId,
                AdminId = demande.AdminId,
                Type = demande.Type,
                DateDebut = demande.DateDebut,
                DateFin = demande.DateFin,
                Justificatif = demande.Justificatif,
                Police = demande.Police,
                Status = "Emis"
            };

            // Ajoutez la nouvelle demande à la base de données
            _context.Demandes.Add(nouvelleDemande);
            await _context.SaveChangesAsync();

            return Ok();
        }



        [HttpPost("pris/{id}/{adminId}")]
        public async Task<IActionResult> PrisEnCharge(int id, int adminId)
        {
            // Récupérez la demande existante à partir de l'ID
            var demande = await _context.Demandes.FindAsync(id);
            if (demande == null)
            {
                return NotFound();
            }

            var nouvelleDemande = new Demande
            {
                // Copiez les propriétés de la demande existante
                Titre = demande.Titre,
                Description = demande.Description,
                Priorite = demande.Priorite,
                Date = DateTime.Now,
                Document = demande.Document,
                Mois = demande.Mois,
                Motif = demande.Motif,
                Destinataire = demande.Destinataire,
                DateSortie = demande.DateSortie,
                UtilisateurId = demande.UtilisateurId,
                AdminId = adminId,
                Type = demande.Type,
                DateDebut = demande.DateDebut,
                DateFin = demande.DateFin,
                Justificatif = demande.Justificatif,
                Police = demande.Police,
                Status = "Pris en charge"
            };

            var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == demande.UtilisateurId && u.Supprimé == false);

            if (utilisateur != null)
            {
                // Composer et envoyer le message
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                message.To.Add(new MailboxAddress($"{utilisateur.Prenom} {utilisateur.Nom}", utilisateur.Email));
                message.Subject = "Demande pris en charge";
                message.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Demande pris en charge</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {utilisateur.Nom} {utilisateur.Prenom},</p><p>Nous sommes heureux de vous informer que votre demande de <strong>{demande.Titre}</strong> a été pris en charge.</p><p style=\"margin-bottom:25px;\">Veuillez noter que les informations sont disponibles sur site.</p><a href=\"http://localhost:4200/login\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
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

            // Ajoutez la nouvelle demande à la base de données
            _context.Demandes.Add(nouvelleDemande);
            await _context.SaveChangesAsync();

            return Ok();
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> ApprouverDemande(int id, [FromBody] Demande demande)
        {
            if (id != demande.id)
            {
                return BadRequest();
            }

            var nouvelleDemande = new Demande
            {
                // Copiez les propriétés de la demande existante
                Titre = demande.Titre,
                Description = demande.Description,
                Priorite = demande.Priorite,
                Date = DateTime.Now,
                Document = demande.Document,
                Mois = demande.Mois,
                Motif = demande.Motif,
                Destinataire = demande.Destinataire,
                DateSortie = demande.DateSortie,
                UtilisateurId = demande.UtilisateurId,
                AdminId = demande.AdminId,
                Type = demande.Type,
                DateDebut = demande.DateDebut,
                DateFin = demande.DateFin,
                Justificatif = demande.Justificatif,
                Police = demande.Police,

            };

            if (string.IsNullOrEmpty(demande.Document))
            {
                nouvelleDemande.Status = "Pris en charge";
            }
            else
            {
                nouvelleDemande.Status = "Résolue";

                var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == demande.UtilisateurId && u.Supprimé == false);

                if (utilisateur != null)
                {
                    // Composer et envoyer le message
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                    message.To.Add(new MailboxAddress($"{utilisateur.Prenom} {utilisateur.Nom}", utilisateur.Email));
                    message.Subject = "Demande résolue";
                    message.Body = new TextPart(TextFormat.Html)
                    {
                        Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Demande résolue</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {utilisateur.Nom} {utilisateur.Prenom},</p><p>Nous sommes heureux de vous informer que votre demande de <strong>{demande.Titre}</strong> a été résolue.</p><p style=\"margin-bottom:25px;\">Veuillez noter que votre document est disponible sur site.</p><a href=\"http://localhost:4200/login\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
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

            _context.Demandes.Add(nouvelleDemande);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectDemande(int id)
        {
            var demande = await _context.Demandes.FindAsync(id);

            if (demande == null)
            {
                return NotFound();
            }


            var nouvelleDemande = new Demande
            {
                // Copiez les propriétés de la demande existante
                Titre = demande.Titre,
                Description = demande.Description,
                Priorite = demande.Priorite,
                Date = DateTime.Now,
                Document = demande.Document,
                Mois = demande.Mois,
                Motif = demande.Motif,
                Destinataire = demande.Destinataire,
                DateSortie = demande.DateSortie,
                UtilisateurId = demande.UtilisateurId,
                AdminId = demande.AdminId,
                Type = demande.Type,
                DateDebut = demande.DateDebut,
                DateFin = demande.DateFin,
                Justificatif = demande.Justificatif,
                Police = demande.Police,
                Status = "Refusée",
        };


            var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == demande.UtilisateurId && u.Supprimé == false);

            if (utilisateur != null)
            {
                // Composer et envoyer le message
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                message.To.Add(new MailboxAddress($"{utilisateur.Prenom} {utilisateur.Nom}", utilisateur.Email));
                message.Subject = "Demande refusée";
                message.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Demande refusée</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {utilisateur.Nom} {utilisateur.Prenom},</p><p>Nous sommes au regret de vous informer que votre demande de <strong>{demande.Titre}</strong> a été refusée.</p><p style=\"margin-bottom:25px;\">Veuillez noter que toutes les informations sont disponibles sur site.</p><a href=\"http://localhost:4200/login\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
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

            _context.Demandes.Add(nouvelleDemande);
            await _context.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("cloturer/{id}")]
        public async Task<IActionResult> CloturerDemande(int id)
        {
            // Récupérez la demande existante à partir de l'ID
            var demande = await _context.Demandes.FindAsync(id);
            if (demande == null)
            {
                return NotFound();
            }

            // Créez une nouvelle demande avec le statut "emis"
            var nouvelleDemande = new Demande
            {
                // Copiez les propriétés de la demande existante
                Titre = demande.Titre,
                Description = demande.Description,
                Priorite = demande.Priorite,
                Date = DateTime.Now,
                Document = demande.Document,
                Mois = demande.Mois,
                Motif = demande.Motif,
                Destinataire = demande.Destinataire,
                DateSortie = demande.DateSortie,
                UtilisateurId = demande.UtilisateurId,
                AdminId = demande.AdminId,
                Type = demande.Type,
                DateDebut = demande.DateDebut,
                DateFin = demande.DateFin,
                Justificatif = demande.Justificatif,
                Police = demande.Police,
                Status = "Cloturée"
            };

            var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == demande.AdminId && u.Supprimé == false);
            var user = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == demande.UtilisateurId && u.Supprimé == false);

            if (utilisateur != null)
            {
                // Composer et envoyer le message
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                message.To.Add(new MailboxAddress($"{utilisateur.Prenom} {utilisateur.Nom}", utilisateur.Email));
                message.Subject = "Demande cloturée";
                message.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Demande cloturée</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {utilisateur.Nom} {utilisateur.Prenom},</p><p>Nous sommes heureux de vous informer que la demande de <strong> {user.Nom} {user.Prenom} ( {demande.Titre} )</strong> a été cloturée avec succés.</p><p style=\"margin-bottom:25px;\">Veuillez noter que les informations sont disponibles sur site.</p><a href=\"http://localhost:4200/login\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
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

            // Ajoutez la nouvelle demande à la base de données
            _context.Demandes.Add(nouvelleDemande);
            await _context.SaveChangesAsync();

            return Ok();
        }


        [HttpPut("reouvrir/{id}")]
        public async Task<IActionResult> RéouvrirDemande(int id, [FromBody] Demande demande)
        {
            if (id != demande.id)
            {
                return BadRequest();
            }

            var nouvelleDemande = new Demande
            {
                // Copiez les propriétés de la demande existante
                Titre = demande.Titre,
                Description = demande.Description,
                Priorite = demande.Priorite,
                Date = DateTime.Now,
                Document = demande.Document,
                Mois = demande.Mois,
                Motif = demande.Motif,
                Destinataire = demande.Destinataire,
                DateSortie = demande.DateSortie,
                UtilisateurId = demande.UtilisateurId,
                AdminId = demande.AdminId,
                Type = demande.Type,
                DateDebut = demande.DateDebut,
                DateFin = demande.DateFin,
                Justificatif = demande.Justificatif,
                Police = demande.Police,

            };

                nouvelleDemande.Status = "Réouvert";

                var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == demande.AdminId && u.Supprimé == false);
                var user = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == demande.UtilisateurId && u.Supprimé == false);

            if (utilisateur != null)
                {
                    // Composer et envoyer le message
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                    message.To.Add(new MailboxAddress($"{utilisateur.Prenom} {utilisateur.Nom}", utilisateur.Email));
                    message.Subject = "Demande réouverte";
                    message.Body = new TextPart(TextFormat.Html)
                    {
                        Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Demande réouverte</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {utilisateur.Nom} {utilisateur.Prenom},</p><p>Nous vous informons que la demande de <strong> {user.Nom} {user.Prenom} ( {demande.Titre} )</strong> a été réouverte.</p><p style=\"margin-bottom:25px;\">Veuillez noter que les informations sont disponibles sur site.</p><a href=\"http://localhost:4200/login\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
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

            _context.Demandes.Add(nouvelleDemande);
            await _context.SaveChangesAsync();

            return Ok();
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDemande(int id)
        {
            var demande = await _context.Demandes.FindAsync(id);
            if (demande == null)
            {
                return NotFound();
            }

            _context.Demandes.Remove(demande);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DemandeExists(int id)
        {
            return _context.Demandes.Any(e => e.id == id);
        }

        // GET: api/Demande/stats/count
        [HttpGet("stats/count")]
        public IActionResult GetDemandeCount()
        {
            var count = _context.Demandes.Where(d => d.Status == "Emis").Count();
            return Ok(count);
        }

        // GET: api/Demande/stats/status
        [HttpGet("stats/status")]
        public IActionResult GetDemandeStatus()
        {
            // Get the count of each status
            var statusCounts = _context.Demandes
                .Where(d => d.Status != "Draft")
                .GroupBy(d => d.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToList();

            return Ok(statusCounts);
        }

        // GET: api/Demande/stats/titre
        [HttpGet("stats/titre")]
        public IActionResult GetDemandesByTitre()
        {
            var demandesByTitre = _context.Demandes
                .Where(d => d.Status == "Emis")
                .GroupBy(d => d.Titre)
                .Select(g => new { Titre = g.Key, Count = g.Count() })
                .ToList();

            return Ok(demandesByTitre);
        }
    }
}
