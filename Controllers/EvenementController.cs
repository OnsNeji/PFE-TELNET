using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;

namespace TelnetTeamBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EvenementController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public EvenementController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _config = configuration;
        }

        // GET: api/Evenement
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Evenement>>> GetEvenements()
        {
            return await _context.Evenements.Include(e => e.MediaEvents).ToListAsync();
        }

        // GET: api/Evenement/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Evenement>> GetEvenement(int id)
        {
            var evenement = await _context.Evenements.Include(e => e.MediaEvents).FirstOrDefaultAsync(e => e.id == id);

            if (evenement == null)
            {
                return NotFound();
            }

            return evenement;
        }

        [HttpGet("latest")]
        public ActionResult<IEnumerable<Evenement>> GetLatestEvenements()
        {
            var latestEvenements = _context.Evenements.Include(e => e.MediaEvents)
                .OrderByDescending(u => u.DateEvent)
                .Take(15)
                .ToList();

            return Ok(latestEvenements);
        }

        //[HttpPost]
        //public async Task<ActionResult<Evenement>> PostEvenement([FromForm] Evenement evenement, [FromForm] List<int> siteIds, [FromForm] List<IFormFile> mediaEvents)
        //{

        //    List<MédiaEvent> mediaEventList = new List<MédiaEvent>();
        //    List<SiteEvenement> siteEvenementList = new List<SiteEvenement>();

        //    foreach (var file in mediaEvents)
        //    {
        //        string base64String;
        //        using (var ms = new MemoryStream())
        //        {
        //            await file.CopyToAsync(ms);
        //            byte[] fileBytes = ms.ToArray();
        //            base64String = Convert.ToBase64String(fileBytes);
        //        }

        //        MédiaEvent mediaEvent = new MédiaEvent();
        //        mediaEvent.PieceJointe = $"data:{file.ContentType};base64,{base64String}";
        //        mediaEvent.Evenement = evenement;
        //        mediaEventList.Add(mediaEvent);
        //    }

        //    foreach (var siteId in siteIds)
        //    {
        //        Site site = await _context.Sites.FindAsync(siteId);

        //        SiteEvenement siteEvenement = new SiteEvenement();
        //        siteEvenement.Site = site;
        //        siteEvenement.Evenement = evenement;
        //        siteEvenementList.Add(siteEvenement);
        //    }

        //    evenement.MediaEvents = mediaEventList;
        //    evenement.SiteEvenements = siteEvenementList;

        //    _context.Evenements.Add(evenement);
        //    // Add notification
        //    Notification notification = new Notification
        //    {
        //        Message = "Nouvel évenement ajouté",
        //        Date = DateTime.Now,
        //        UserAjout = evenement.UserAjout,
        //        Evenement = evenement
        //    };
        //    _context.notifications.Add(notification);
        //    await _context.SaveChangesAsync();

        //    var users = await _context.Utilisateurs.Where(u => u.Supprimé == false).ToListAsync();
        //    foreach (var user in users)
        //    {
        //        var message = new MimeMessage();
        //        message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
        //        message.To.Add(new MailboxAddress($"{user.Prenom} {user.Nom}", user.Email));
        //        message.Subject = "Nouvel événement ajouté";
        //        message.Body = new TextPart(TextFormat.Html)
        //        {
        //            Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Nouvel événement ajouté</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {user.Nom} {user.Prenom},</p><p>Nous sommes heureux de vous informer qu'un nouvel événement a été ajouté.</p><p style=\"margin-bottom:25px;\">Veuillez noter que toutes les informations concernant le nouvel événement sont disponibles sur site.</p><a href=\"http://localhost:4200/accueil\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
        //        };


        //        using (var client = new SmtpClient())
        //        {
        //            try
        //            {
        //                client.Connect(_config["EmailSettings:SmtpServer"], 465, true);
        //                client.Authenticate(_config["EmailSettings:From"], _config["EmailSettings:Password"]);
        //                client.Send(message);

        //            }
        //            catch (Exception ex)
        //            {
        //                throw;
        //            }
        //            finally
        //            {
        //                client.Disconnect(true);
        //                client.Dispose();
        //            }
        //        }
        //    }

        //    return CreatedAtAction(nameof(GetEvenement), new { id = evenement.id }, evenement);
        //}


        //// PUT: api/Evenement/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutEvenement(int id, [FromBody] Evenement evenement)
        //{
        //    if (id != evenement.id)
        //    {
        //        return BadRequest();
        //    }

        //    var sitesIds = evenement.SiteEvenements.Select(se => se.SiteId);

        //    // récupérer les sites existants à partir de la base de données
        //    var sites = await _context.Sites.Where(s => sitesIds.Contains(s.id)).ToListAsync();

        //    // mettre à jour les relations entre les sites et l'événement
        //    foreach (var site in sites)
        //    {
        //        if (!evenement.SiteEvenements.Any(se => se.SiteId == site.id))
        //        {
        //            evenement.SiteEvenements.Add(new SiteEvenement { SiteId = site.id, EvenementId = evenement.id });
        //        }
        //    }

        //    _context.Entry(evenement).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!EvenementExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}


        //[HttpPost]
        //public async Task<ActionResult<Evenement>> PostEvenement([FromForm]Evenement evenement, [FromForm] List<IFormFile> mediaEvents)
        //{

        //    List<MédiaEvent> mediaEventList = new List<MédiaEvent>();

        //    foreach (var file in mediaEvents)
        //    {
        //        string base64String;
        //        using (var ms = new MemoryStream())
        //        {
        //            await file.CopyToAsync(ms);
        //            byte[] fileBytes = ms.ToArray();
        //            base64String = Convert.ToBase64String(fileBytes);
        //        }

        //        MédiaEvent mediaEvent = new MédiaEvent();
        //        mediaEvent.PieceJointe = $"data:{file.ContentType};base64,{base64String}";
        //        mediaEvent.Evenement = evenement;
        //        mediaEventList.Add(mediaEvent);
        //    }

        //    evenement.MediaEvents = mediaEventList;

        //    _context.Evenements.Add(evenement);
        //    // Add notification
        //    Notification notification = new Notification
        //    {
        //        Message = "Nouvel évenement ajouté",
        //        Date = DateTime.Now,
        //        UserAjout = evenement.UserAjout,
        //        Evenement = evenement
        //    };
        //    _context.notifications.Add(notification);
        //    await _context.SaveChangesAsync();

        //    var users = await _context.Utilisateurs.Where(u => u.Supprimé == false).ToListAsync();
        //    foreach (var user in users)
        //    {
        //        var message = new MimeMessage();
        //        message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
        //        message.To.Add(new MailboxAddress($"{user.Prenom} {user.Nom}", user.Email));
        //        message.Subject = "Nouvel événement ajouté";
        //        message.Body = new TextPart(TextFormat.Html)
        //        {
        //            Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Nouvel événement ajouté</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {user.Nom} {user.Prenom},</p><p>Nous sommes heureux de vous informer qu'un nouvel événement a été ajouté.</p><p style=\"margin-bottom:25px;\">Veuillez noter que toutes les informations concernant le nouvel événement sont disponibles sur site.</p><a href=\"http://localhost:4200/accueil\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
        //        };


        //        using (var client = new SmtpClient())
        //        {
        //            try
        //            {
        //                client.Connect(_config["EmailSettings:SmtpServer"], 465, true);
        //                client.Authenticate(_config["EmailSettings:From"], _config["EmailSettings:Password"]);
        //                client.Send(message);

        //            }
        //            catch (Exception ex)
        //            {
        //                throw;
        //            }
        //            finally
        //            {
        //                client.Disconnect(true);
        //                client.Dispose();
        //            }
        //        }
        //    }

        //    return CreatedAtAction(nameof(GetEvenement), new { id = evenement.id }, evenement);
        //}


        [HttpPost]
        public async Task<ActionResult<Evenement>> PostEvenement([FromForm] Evenement evenement, [FromForm] List<IFormFile> mediaEvents)
        {
            // Convertir les fichiers média en chaînes base64
            List<MédiaEvent> mediaEventList = new List<MédiaEvent>();

            foreach (var file in mediaEvents)
            {
                string base64String;
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);
                    byte[] fileBytes = ms.ToArray();
                    base64String = Convert.ToBase64String(fileBytes);
                }

                MédiaEvent mediaEvent = new MédiaEvent();
                mediaEvent.PieceJointe = $"data:{file.ContentType};base64,{base64String}";
                mediaEventList.Add(mediaEvent);
            }

            evenement.MediaEvents = mediaEventList;

            // Ajouter l'événement à la base de données
            _context.Evenements.Add(evenement);

            // Ajouter une notification
            Notification notification = new Notification
            {
                Message = "Nouvel événement ajouté",
                Date = DateTime.Now,
                UserAjout = evenement.UserAjout,
                Evenement = evenement
            };
            _context.notifications.Add(notification);

            await _context.SaveChangesAsync();

            // Envoyer des notifications par e-mail aux utilisateurs
            var users = await _context.Utilisateurs.Where(u => u.Supprimé == false).ToListAsync();
            foreach (var user in users)
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                message.To.Add(new MailboxAddress($"{user.Prenom} {user.Nom}", user.Email));
                message.Subject = "Nouvel événement ajouté";
                message.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Nouvel événement ajouté</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {user.Nom} {user.Prenom},</p><p>Nous sommes heureux de vous informer qu'un nouvel événement a été ajouté.</p><p style=\"margin-bottom:25px;\">Veuillez noter que toutes les informations concernant le nouvel événement sont disponibles sur site.</p><a href=\"http://localhost:4200/accueil\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
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
                        // Gérer l'exception appropriée
                        throw;
                    }
                    finally
                    {
                        client.Disconnect(true);
                        client.Dispose();
                    }
                }
            }

            return CreatedAtAction(nameof(GetEvenement), new { id = evenement.id }, evenement);
        }


        // PUT: api/Evenement/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvenement(int id, [FromBody] Evenement evenement)
        {
            if (id != evenement.id)
            {
                return BadRequest();
            }

            _context.Entry(evenement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EvenementExists(id))
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

        // DELETE: api/Evenement/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvenement(int id)
        {
            var evenement = await _context.Evenements.FindAsync(id);
            if (evenement == null)
            {
                return NotFound();
            }
            var notification = await _context.notifications.FirstOrDefaultAsync(n => n.EvenementId == id);
            if (notification != null)
            {
                _context.notifications.Remove(notification);
                await _context.SaveChangesAsync();
            }
            _context.Evenements.Remove(evenement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EvenementExists(int id)
        {
            return _context.Evenements.Any(e => e.id == id);
        }

        // GET: api/Evenement/stats/total
        [HttpGet("stats/total")]
        public IActionResult GetTotalEvenements()
        {
            var totalEvenements = _context.Evenements.Count();

            return Ok(totalEvenements);
        }

        //[HttpGet("stats/categorie")]
        //public IActionResult GetCategoryEvent()
        //{
        //    // Get the count of each status
        //    var categorieCounts = _context.Evenements
        //        .GroupBy(d => d.Categorie)
        //        .Select(g => new { Categorie = g.Key, Count = g.Count() })
        //        .ToList();

        //    return Ok(categorieCounts);
        //}

        [HttpGet("statsCombine")]
        public IActionResult GetStatsCombine()
        {
            // Get the count of events by month and year
            var eventsByMonth = _context.Evenements
                .GroupBy(e => new { Month = e.DateEvent.Month, Year = e.DateEvent.Year })
                .Select(g => new { MonthYear = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month) + " " + g.Key.Year.ToString(), Count = g.Count(), Type = "Evenement" })
                .ToList();

            // Get the count of nouveautes by month and year
            var nouveautesByMonth = _context.Nouveautés
                .GroupBy(n => new { Month = n.DatePublication.Month, Year = n.DatePublication.Year })
                .Select(g => new { MonthYear = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month) + " " + g.Key.Year.ToString(), Count = g.Count(), Type = "Nouveaute" })
                .ToList();

            var statsByMonth = eventsByMonth.Concat(nouveautesByMonth)
                .GroupBy(s => s.MonthYear)
                .Select(g => new { MonthYear = g.Key, CountEvent = g.Where(s => s.Count > 0 && s.Type == "Evenement").Sum(s => s.Count), CountNouv = g.Where(s => s.Count > 0 && s.Type == "Nouveaute").Sum(s => s.Count) })
                .ToList();

            return Ok(statsByMonth);
        }
    }
}