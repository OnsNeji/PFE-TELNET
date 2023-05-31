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
using PdfSharpCore;
using PdfSharpCore.Pdf;
using TheArtOfDev.HtmlRenderer.PdfSharp;
using System.IO;

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
                .Include(m => m.Historiques)
                .Include(m => m.Utilisateur)
                .Where(m => m.Utilisateur.Supprimé == false)
                .ToListAsync();

            return demandes;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Demande>> GetDemande(int id)
        {
            var demande = await _context.Demandes.Include(m => m.Historiques).FirstOrDefaultAsync(e => e.id == id);

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
        public async Task<ActionResult<Demande>> PostDemande([FromBody] Demande demande)
        {
            demande.Status = "Draft";
            demande.Date = DateTime.Now;
            if (demande.Titre == "Fiche de paie" || demande.Titre == "Attestation de travail" || demande.Titre == "Lettre de recommandation")
            {
                demande.DateSortie = null;
            }
            else if (demande.Titre == "Autorisation de sortie" || demande.Titre == "Attestation de travail" || demande.Titre == "Lettre de recommandation")
            {
                demande.Mois = null;
            }

            _context.Demandes.Add(demande);
            await _context.SaveChangesAsync();

            // Create a new Historique entry
            var historique = new Historique
            {
                Etat = "Draft",
                DateEtat = DateTime.Now,
                DemandeId = demande.id
            };

            _context.Historiques.Add(historique);
            _context.SaveChanges();

            return Ok(demande);
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

            demande.Status = "Emis";
            demande.Date = DateTime.Now;

            // Create a new Historique entry
            var historique = new Historique
            {
                Etat = "Emis",
                DateEtat = DateTime.Now,
                DemandeId = demande.id
            };

            _context.Historiques.Add(historique);
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

            // Update the adminId attribute
            demande.AdminId = adminId;
            demande.Status = "Pris en charge";
            demande.Date = DateTime.Now;

            // Create a new Historique entry
            var historique = new Historique
            {
                Etat = "Pris en charge",
                DateEtat = DateTime.Now,
                DemandeId = demande.id
            };

            _context.Historiques.Add(historique);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}/resoudre")]
        public async Task<IActionResult> ApprouverDemande(int id)
        {

            // Récupérez la demande existante à partir de l'ID
            var demande = await _context.Demandes.FindAsync(id);
            if (demande == null)
            {
                return NotFound();
            }
            demande.Status = "Résolu";
            demande.Date = DateTime.Now;
            // Create a new Historique entry
            var historique = new Historique
            {
                Etat = "Résolu",
                DateEtat = DateTime.Now,
                DemandeId = demande.id
            };

            _context.Historiques.Add(historique);
            _context.SaveChanges();

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

            var admin = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == demande.AdminId && u.Supprimé == false);

            var document = new PdfDocument();
            DateTime dateApprobation = DateTime.Now;

            if (demande.Titre == "Attestation de travail")
            {
                string htmlContent = $"<html><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><h1 style='text-align: center; margin-top: 2%;'> {demande.Titre} </h1><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Je soussigné(e), M./Mme <strong>{admin.Nom} {admin.Prenom}</strong>, agissant en tant que <strong>{ admin.Role }</strong> au sein de l'entreprise <strong>Telnet Holding</strong>, atteste par la présente que M./Mme <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong>, né(e) le {utilisateur.DateNaissance.ToString("dd/MM/yyyy")}, a été employé(e) par notre entreprise depuis <strong>{utilisateur.DateEmbauche.ToString("dd/MM/yyyy")}</strong> en tant que <strong>{utilisateur.Role}</strong>.<br><br>Durant son emploi, M./Mme <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong> a rempli ses fonctions avec professionnalisme, compétence et dévouement. Son salaire mensuel brut était de <strong>{utilisateur.Salaire}</strong> Dinars et il/elle était employé(e) à temps plein.<br><br>Cette attestation est délivrée à la demande de l'intéressé(e) pour servir et valoir ce que de droit.</p><br><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{dateApprobation.ToString("dd/MM/yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>";
                PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
            }
            else if (demande.Titre == "Attestation de stage")
            {
                if (string.IsNullOrEmpty(demande.Etudiant2))
                {
                    string htmlContent = $"<html><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><h1 style='text-align: center; margin-top: 2%;'> {demande.Titre} </h1><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Je soussigné(e), M./Mme <strong>{admin.Nom} {admin.Prenom}</strong>, agissant en tant que <strong>{ admin.Role }</strong> au sein de l'entreprise <strong>Telnet Holding</strong>, atteste par la présente que M./Mme <strong>{demande.Etudiant1}</strong>, étudiant à {demande.Fac} a effectué un stage au sein de notre entreprise, du <strong>{demande.DebutS.Value.ToString("dd/MM/yyyy")}</strong> au <strong>{demande.FinS.Value.ToString("dd/MM/yyyy")}</strong> et a été encadré(e) par M./Mme <strong>{admin.Nom} {admin.Prenom}</strong>.<br><br>Durant cette période, l'étudiant(e) a fait preuve de sérieux, de diligence et de professionnalisme tout au long de son stage. Sa contribution a été appréciée et a eu un impact positif sur nos activités. Je tiens également à souligner que M./Mme <strong>{demande.Etudiant1}</strong> s'est montré(e) motivé(e), dynamique et a su s'adapter rapidement à notre environnement de travail.<br><br>Cette attestation est délivrée à la demande de l'intéressé(e) pour servir et valoir ce que de droit.</p><br><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{dateApprobation.ToString("dd/MM/yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>";
                    PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
                }
                else 
                {
                    string htmlContent = $"<html><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><h1 style='text-align: center; margin-top: 2%;'> {demande.Titre} </h1><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Je soussigné(e), M./Mme <strong>{admin.Nom} {admin.Prenom}</strong>, agissant en tant que <strong>{ admin.Role }</strong> au sein de l'entreprise <strong>Telnet Holding</strong>, atteste par la présente que M./Mme <strong>{demande.Etudiant1}</strong> et M./Mme <strong>{demande.Etudiant2}</strong>, étudiants à {demande.Fac} ont effectué un stage au sein de notre entreprise, du <strong>{demande.DebutS.Value.ToString("dd/MM/yyyy")}</strong> au <strong>{demande.FinS.Value.ToString("dd/MM/yyyy")}</strong> et ont été encadrés par M./Mme <strong>{admin.Nom} {admin.Prenom}</strong>.<br><br>Durant cette période, les étudiants ont fait preuve de sérieux, de diligence et de professionnalisme tout au long de leur stage. Leur contribution a été appréciée et a eu un impact positif sur nos activités. Je tiens également à souligner que M./Mme <strong>{demande.Etudiant1}</strong> et M./Mme <strong>{demande.Etudiant2}</strong> se sont montrés motivés, dynamiques et ont su s'adapter rapidement à notre environnement de travail.<br><br>Cette attestation est délivrée à la demande de l'intéressé(e) pour servir et valoir ce que de droit.</p><br><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{dateApprobation.ToString("dd/MM/yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>";
                    PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
                }
            }
            else if (demande.Titre == "Attestation de salaire")
            {

                if (demande.Choix == "Mensuel")
                {
                    string htmlContent = $"<html><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><h1 style='text-align: center; margin-top: 2%;'> {demande.Titre} </h1><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Je soussigné(e), M./Mme <strong>{admin.Nom} {admin.Prenom}</strong>, représentant légal de l'entreprise <strong>Telnet Holding</strong>, atteste par la présente que M./Mme <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong>, né(e) le {utilisateur.DateNaissance.ToString("dd/MM/yyyy")}, occupe le poste de <strong>{utilisateur.Role}</strong> au sein de notre entreprise depuis le <strong>{utilisateur.DateEmbauche.ToString("dd/MM/yyyy")}</strong> jusqu'à la présente date, soit le <strong>{demande.Date.ToString("dd/MM/yyyy")}</strong> avec un salaire mensuel brut de <strong>{utilisateur.Salaire}</strong> Dinars.<br><br>Je précise également que toutes les retenues et cotisations sociales sont effectuées conformément à la législation en vigueur.<br><br>Cette attestation est délivrée à la demande de l'intéressé(e) pour servir et valoir ce que de droit.</p><br><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{dateApprobation.ToString("dd/MM/yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>";
                    PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
                }
                else if (demande.Choix == "Annuel")
                {
                    string htmlContent = $"<html><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><h1 style='text-align: center; margin-top: 2%;'> {demande.Titre} </h1><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Je soussigné(e), M./Mme <strong>{admin.Nom} {admin.Prenom}</strong>, représentant légal de l'entreprise <strong>Telnet Holding</strong>, atteste par la présente que M./Mme <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong>, né(e) le {utilisateur.DateNaissance.ToString("dd/MM/yyyy")}, occupe le poste de <strong>{utilisateur.Role}</strong> au sein de notre entreprise depuis le <strong>{utilisateur.DateEmbauche.ToString("dd/MM/yyyy")}</strong> jusqu'à la présente date, soit le <strong>{demande.Date.ToString("dd/MM/yyyy")}</strong> avec un salaire annuel brut de <strong>{utilisateur.Salaire * 12}</strong> Dinars.<br><br>Je précise également que toutes les retenues et cotisations sociales sont effectuées conformément à la législation en vigueur.<br><br>Cette attestation est délivrée à la demande de l'intéressé(e) pour servir et valoir ce que de droit.</p><br><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{dateApprobation.ToString("dd/MM/yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>";
                    PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
                }
                
            }
            else if (demande.Titre == "Fiche de paie")
            {
                string htmlContent = $"<html><head><title>Fiche de paie</title><style>body {{ font-family: Arial, sans-serif; }}.container {{ margin: 0 auto; width: 500px; }}h1 {{ text-align: center; }}.employee-info {{ margin-bottom: 20px; }}.employee-info h4 {{ display: inline-block; width: 150px; }}table {{ width: 100%; border-collapse: collapse; margin-bottom: 20px; }}th, td {{ padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }}th {{ background-color: #f2f2f2; }}.totals {{ font-weight: bold; }}</style></head><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><div class='container'><h1>{demande.Titre}</h1><div class='employee-info'><h4 style='display : inline;'>Employé(e):</h4> {utilisateur.Nom} {utilisateur.Prenom}<br><h4 style='display : inline;'>Role:</h4> {utilisateur.Role}<br><h4 style='display : inline;'>Mois:</h4> {demande.Mois.Value.ToString("MM/yyyy")}</div><table><tr><th>Description</th><th>Montant</th></tr><tr><td>Salaire de base</td><td>{utilisateur.Salaire} DT</td></tr><tr><td>Heures supplémentaires</td><td>300 DT</td></tr><tr><td>Avantages en nature</td><td>100 DT</td></tr><tr><td>Total des revenus</td><td class='totals'>{utilisateur.Salaire + 400} DT</td></tr><tr><td>Retenue impôt</td><td>400 DT</td></tr><tr><td>Cotisations sociales</td><td>200 DT</td></tr><tr><td>Total des déductions</td><td class='totals'>600 DT</td></tr><tr><td>Salaire net</td><td class='totals'>{utilisateur.Salaire - 200} DT</td></tr></table></div><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{dateApprobation.ToString("dd / MM / yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>";
                PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
            }
            else if (demande.Titre == "Autorisation de sortie")
            {
                string htmlContent = $"<html><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><h1 style='text-align: center; margin-top: 2%;'> {demande.Titre} </h1><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Je soussigné(e), M./Mme <strong>{admin.Nom} {admin.Prenom}</strong>, agissant en tant que <strong>{ admin.Role }</strong> au sein de l'entreprise <strong>Telnet Holding</strong>, donne par la présente une autorisation de sortie à M./Mme <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong>, le <strong>{demande.DateSortie.Value.ToString("dd/MM/yyyy")}</strong> à <strong>{demande.HeureSortie}</strong>.<br><br>Pendant la période autorisée, l'employé(e) est autorisé(e) à quitter le lieu de travail. Il/Elle est tenu(e) de respecter les règles de sécurité en vigueur et de notifier immédiatement son supérieur hiérarchique en cas de retard ou de changement de plan.<br><br>Cette autorisation est valable uniquement pour la date spécifiée et ne peut être utilisée à d'autres fins que celles mentionnées ci-dessus.</p><br><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{dateApprobation.ToString("dd/MM/yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>";
                PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
            }
            else if (demande.Titre == "Lettre de recommandation")
            {
                string htmlContent = $"<html><body><img src='uploads/logo.png' style='width: 20%; margin-top: 2%; margin-left: 3%;'><h1 style='text-align: center; margin-top: 2%;'>{demande.Titre} </h1><p style='width: 100%; text-align: center; margin-left: 5%; margin-top: 3%; line-height: 1.5;'>Je soussigné(e), M./Mme <strong>{admin.Nom} {admin.Prenom}</strong>, <strong>{ admin.Role }</strong> au sein de l'entreprise <strong>Telnet Holding</strong>, suis ravi(e) de rédiger cette lettre de recommandation pour M./Mme <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong>.<br><br>J'ai eu le plaisir de travailler étroitement avec <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong> depuis <strong>{utilisateur.DateEmbauche.ToString("dd/MM/yyyy")}</strong>. <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong> a été employé(e) au poste de <strong>{utilisateur.Role}</strong> au sein de notre entreprise.<br><br>Au cours de sa collaboration avec notre entreprise, <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong> a fait preuve de compétences exceptionnelles, d'un engagement constant et d'un professionnalisme exemplaire. <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong> a constamment délivré un travail de qualité, faisant preuve d'une grande attention aux détails et d'une excellente gestion du temps.<br><br><strong>{utilisateur.Nom} {utilisateur.Prenom}</strong> a également démontré une aptitude exceptionnelle à travailler en équipe, favorisant une atmosphère positive et collaborative au sein de notre entreprise. Il/Elle est doté(e) d'excellentes compétences en communication, ce qui lui permet de communiquer efficacement avec ses collègues et les parties prenantes externes. <br><br>En tant qu'employé(e), <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong> a su faire preuve d'initiative et d'autonomie. Il/Elle est capable de résoudre les problèmes de manière créative et de prendre des décisions éclairées. <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong> est également reconnu(e) poursa capacité à s'adapter rapidement aux nouvelles situations et à gérer avec succès les défis rencontrés. <br><br>Je suis convaincu(e) que <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong> apportera une contribution significative à toute organisation qui lui accordera une opportunité professionnelle. Il/Elle possède un ensemble de compétences solides et des qualités personnelles qui font de <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong> un atout précieux. <br><br>Je recommande fortement <strong>{utilisateur.Nom} {utilisateur.Prenom}</strong> pour toute opportunité professionnelle correspondant à son profil. Pour toute demande de renseignements supplémentaires, n'hésitez pas à nous contacter. <br> <br>Je vous prie d'agréer, Monsieur/Madame le responsable au sein de <strong>{demande.Destinataire}</strong>, l'expression de ma considération distinguée.</p><br><p style='margin-left: 25em;'>Fait à Tunis, le <strong>{dateApprobation.ToString("dd/MM/yyyy")}</strong></p><img src='uploads/cachet.jpg' style='width: 20%; margin-top: 2%; margin-left: 26em;'></body></html>"; 
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
            demande.Document = "data:application/pdf;base64," + base64String;
            _context.SaveChanges();
            string Filename = "Invoice.pdf";
            return File(response, "application/pdf", Filename);

            _context.Entry(demande).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DemandeExists(id))
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
        public async Task<IActionResult> RejectDemande(int id)
        {
            // Récupérez la demande existante à partir de l'ID
            var demande = await _context.Demandes.FindAsync(id);
            if (demande == null)
            {
                return NotFound();
            }

            demande.Document = null;
            demande.Status = "Refusé";
            demande.Date = DateTime.Now;
            // Create a new Historique entry
            var historique = new Historique
            {
                Etat = "Refusé",
                DateEtat = DateTime.Now,
                DemandeId = demande.id
            };

            _context.Historiques.Add(historique);
            _context.SaveChanges();

            var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == demande.UtilisateurId && u.Supprimé == false);

            if (utilisateur != null)
            {
                // Composer et envoyer le message
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                message.To.Add(new MailboxAddress($"{utilisateur.Prenom} {utilisateur.Nom}", utilisateur.Email));
                message.Subject = "Demande rejetée";
                message.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Demande rejetée</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {utilisateur.Nom} {utilisateur.Prenom},</p><p>Nous sommes au regret de vous informer que votre demande de <strong>{demande.Titre}</strong> a été rejetée.</p><p style=\"margin-bottom:25px;\">Veuillez noter que toutes les informations sont disponibles sur site.</p><a href=\"http://localhost:4200/login\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
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


            demande.Status = "Cloturé";
            demande.Date = DateTime.Now;
            // Create a new Historique entry
            var historique = new Historique
            {
                Etat = "Cloturé",
                DateEtat = DateTime.Now,
                DemandeId = demande.id
            };

            _context.Historiques.Add(historique);
            _context.SaveChanges();

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

            return Ok();
        }

        [HttpPut("reouvrir/{id}")]
        public async Task<IActionResult> RéouvrirDemande(int id, [FromBody] Demande demande)
        {
            // Récupérez la demande existante à partir de l'ID
            if (id != demande.id)
            {
                return BadRequest();
            }


            demande.Status = "Réouvert";
            demande.Date = DateTime.Now;
            // Create a new Historique entry
            var historique = new Historique
            {
                Etat = "Réouvert",
                DateEtat = DateTime.Now,
                DemandeId = demande.id
            };

            _context.Historiques.Add(historique);
            _context.SaveChanges();

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


            _context.Entry(demande).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DemandeExists(id))
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
            var count = _context.Demandes.Where(d => d.Status != "Draft").Count();
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
                .Where(d => d.Status != "Draft")
                .GroupBy(d => d.Titre)
                .Select(g => new { Titre = g.Key, Count = g.Count() })
                .ToList();

            return Ok(demandesByTitre);
        }
    }
}
