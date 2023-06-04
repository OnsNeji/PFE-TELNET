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
using System.Linq;
using System.Threading.Tasks;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;

namespace TelnetTeamBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConventionController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public ConventionController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _config = configuration;
        }

        // GET: api/Convention
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Convention>>> GetConventions()
        {
            var conventions = await _context.Conventions.ToListAsync();
            var currentDate = DateTime.Now.Date;

            foreach (var convention in conventions)
            {
                if (convention.DateFin < currentDate)
                {
                    convention.Status = "Expiré";
                } else if (convention.DateFin >= currentDate)
                {
                    convention.Status = "Active";
                }
            }

            await _context.SaveChangesAsync();
            return conventions;
        }


        // GET: api/Convention/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Convention>> GetConvention(int id)
        {
            var convention = await _context.Conventions.FirstOrDefaultAsync(m => m.id == id);

            if (convention == null)
            {
                return NotFound();
            }

            return convention;
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Convention>>> GetConventionsActives()
        {
            DateTime now = DateTime.Now;
            var activConventions = await _context.Conventions
                                    .Where(c => c.DateFin > now)
                                    .ToListAsync();
            return activConventions;
        }

        // POST: api/Convention
        [HttpPost]
        public async Task<ActionResult<Convention>> PostConvention(Convention convention)
        {
            convention.Status = "Active";
            _context.Conventions.Add(convention);
            // Add notification
            Notification notification = new Notification
            {
                Message = "Nouvelle convention ajoutée",
                Date = DateTime.Now,
                UserAjout = convention.UserAjout,
                Convention = convention
            };
            _context.notifications.Add(notification);
            await _context.SaveChangesAsync();

            var users = await _context.Utilisateurs.Where(u => u.Supprimé == false).ToListAsync();
            foreach (var user in users)
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("TELNET Team", "telnetteam.intranet@gmail.com"));
                message.To.Add(new MailboxAddress($"{user.Prenom} {user.Nom}", user.Email));
                message.Subject = "Nouvelle convention ajoutée";
                message.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"<html><head></head><body width=\"100%\" style=\"margin:0; padding:0!important; mso-line-height-rule:exactly; background-color:#f5f6fa;\"><center style=\"width:100%; background-color:#f5f6fa;\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f6fa\"><tr><td style=\"padding:40px 0;\"><table style=\"width:100%; max-width:620px; margin:0 auto; background-color:#ffffff;\"><tbody><tr><td style=\"text-align:center; padding:30px 30px 15px 30px;\"><h2 style=\"font-size:18px; color:#1ba3dd; font-weight:600; margin:0;\">Nouvelle convention ajoutée</h2></td></tr><tr><td style=\"text-align:center; padding:0 30px 20px\"><p style=\"margin-bottom:10px;\">Bonjour {user.Nom} {user.Prenom},</p><p>Nous sommes heureux de vous informer qu'une nouvelle convention a été ajoutée.</p><p style=\"margin-bottom:25px;\">Veuillez noter que toutes les informations concernant la nouvelle convention sont disponibles sur site.</p><a href=\"http://localhost:4200/accueil\" style=\"background-color:#1ba3dd; border-radius:4px; color:#ffffff; display:inline-block; font-size:13px; font-weight:600; line-height:44px; text-align:center; text-decoration:none; text-transform:uppercase; padding:0 25px\">Accéder au site</a></td></tr><tr><td style=\"text-align:center; padding:20px 30px 40px\"><p style=\"margin:0; font-size:13px; line-height:22px; color:#9ea8bb;\">Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p></td></tr></tbody></table><table style=\"width:100%; max-width:620px; margin:0 auto;\"><tbody><tr><td style=\"text-align:center; padding:25px 20px 0;\"><p style=\"padding-top:15px; font-size:12px;\">Cet e-mail vous a été envoyé en tant qu'employé de <a style=\"color:#1ba3dd; text-decoration:none;\" href=\"\">TELNET Team Intranet</a>, pour vous informer de toutes les actualités</p></td></tr></tbody></table></td></tr></table></center></body></html>"
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


            return CreatedAtAction(nameof(GetConvention), new { id = convention.id }, convention);
        }

        // PUT: api/Convention/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConvention(int id, [FromBody] Convention convention)
        {
            if (id != convention.id)
            {
                return BadRequest();
            }

            _context.Entry(convention).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConventionExists(id))
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

        // DELETE: api/Convention/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConvention(int id)
        {
            var convention = await _context.Conventions.FindAsync(id);
            if (convention == null)
            {
                return NotFound();
            }

            // Delete the related Notification entity, if it exists
            var notification = await _context.notifications.FirstOrDefaultAsync(n => n.ConventionId == id);
            if (notification != null)
            {
                _context.notifications.Remove(notification);
                await _context.SaveChangesAsync();
            }

            _context.Conventions.Remove(convention);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConventionExists(int id)
        {
            return _context.Conventions.Any(e => e.id == id);
        }

        // GET: api/Convention/stats/total
        [HttpGet("stats/total")]
        public IActionResult GetTotalConventions()
        {
            // Calculate the total number of conventions in the database
            var totalConventions = _context.Conventions.Count();

            return Ok(totalConventions);
        }

        // GET: api/Convention/stats/monthly
        [HttpGet("stats/monthly")]
        public IActionResult GetMonthlyStatistics()
        {
            var conventionsPerMonth = _context.Conventions
                .GroupBy(c => new { c.DateDebut.Year, c.DateDebut.Month })
                .Select(g => new {
                    Year = g.Key.Year,
                    Month = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month),
                    Count = g.Count()
                })
                .ToList();

            return Ok(conventionsPerMonth );
        }

        // GET: api/Convention/stats/last
        [HttpGet("stats/last")]
        public async Task<ActionResult<Convention>> GetLastConvention()
        {
            var lastConvention = _context.Conventions
                .OrderByDescending(c => c.DateDebut)
                .FirstOrDefault();

            if (lastConvention == null)
            {
                return NotFound();
            }

            return lastConvention;
        }

        // GET: api/Convention/stats/durations
        [HttpGet("stats/durations")]
        public IActionResult GetConventionDurations()
        {
            var conventions = _context.Conventions.ToList();

            var durations = conventions.Select(c => new
            {
                c.id,
                c.Titre,
                c.DateDebut,
                c.DateFin,
                Duration = (c.DateFin.Date - c.DateDebut.Date).Days + 1
            }).ToList();


            return Ok(durations);
        }

        // GET: api/Convention/stats/DaysLeft
        [HttpGet("stats/DaysLeft")]
        public IActionResult GetConventionDaysLeft()
        {
            var conventions = _context.Conventions.Where(c => c.DateFin >= DateTime.Today).ToList();

            var daysLeftByConvention = conventions.Select(c => new
            {
                c.Titre,
                DaysLeft = (int)(c.DateFin - DateTime.Today).TotalDays
            }).ToList();

            return Ok(daysLeftByConvention);
        }

        [HttpGet("display/{zone}/")]
        public IActionResult GetConventionsByZone(string zone)
        {
            try
            {
                var conventions = _context.Conventions
                    .Include(c => c.Catégorie)
                    .Where(c => c.Zone == zone)
                    .ToList();

                return Ok(conventions);
            }
            catch (Exception ex)
            {
                // Handle any potential exceptions
                return StatusCode(500, "An error occurred while retrieving conventions by zone.");
            }
        }

        [HttpGet("display/{categoryId}")]
        public IActionResult GetConventionsByCategory(int categoryId)
        {
            try
            {
                var conventions = _context.Conventions
                    .Include(c => c.Catégorie)
                    .Where(c => c.Catégorie.id == categoryId)
                    .ToList();

                return Ok(conventions);
            }
            catch (Exception ex)
            {
                // Handle any potential exceptions
                return StatusCode(500, "An error occurred while retrieving conventions by category.");
            }
        }


        [HttpGet("{zone}/{categorieId}")]
        public ActionResult<List<Convention>> GetFilteredConventions(string zone, string categorieId)
        {
            var filteredConventions = _context.Conventions.AsQueryable();

            if (!string.IsNullOrEmpty(zone) && zone.ToLower() != "null")
            {
                filteredConventions = filteredConventions.Where(c => c.Zone == zone && c.Status == "Active");
            }

            if (!string.IsNullOrEmpty(categorieId) && categorieId.ToLower() != "null")
            {
                if (int.TryParse(categorieId, out int categoryId))
                {
                    filteredConventions = filteredConventions.Where(c => c.CatégorieId == categoryId && c.Status == "Active");
                }
            }

            var result = filteredConventions.ToList();
            return Ok(result);
        }

    }
}