using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using TelnetTeamBack.Context;
using TelnetTeamBack.Helpers;
using TelnetTeamBack.models;

namespace TelnetTeamBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UtilisateurController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UtilisateurController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Utilisateur>> GetUtilisateurs()
        {
            return _context.Utilisateurs.Where(u => u.Supprimé == false).Include(e => e.Poste).Include(e => e.EmployéMois).Include(e => e.MariageNaissances).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Utilisateur>> GetUtilisateur(int id)
        {
            var utilisateur = await _context.Utilisateurs.Include(e => e.Poste).Include(e => e.EmployéMois).Include(e => e.MariageNaissances).FirstOrDefaultAsync(e => e.id == id);

            if (utilisateur == null)
            {
                return NotFound();
            }

            return utilisateur;
        }

        [HttpGet("latest")]
        public ActionResult<IEnumerable<Utilisateur>> GetLatestUtilisateurs()
        {
            var troisDerniersMois = DateTime.Now.AddMonths(-3);
            var latestUtilisateurs = _context.Utilisateurs
                .Where(u => u.Supprimé == false && u.DateEmbauche >= troisDerniersMois)
                .OrderByDescending(u => u.DateEmbauche)
                .ToList();

            return Ok(latestUtilisateurs);
        }


        [HttpGet("anniversaires")]
        public ActionResult<IEnumerable<Utilisateur>> GetAnniversaires()
        {
            int currentMonth = DateTime.Now.Month;
            var users = _context.Utilisateurs.Where(u => u.Supprimé == false).Where(u => u.DateNaissance.Month == currentMonth && u.Supprimé == false)
                .OrderBy(u => u.DateNaissance.Day < DateTime.Now.Day ? u.DateNaissance.Month + 12 : u.DateNaissance.Month)
                .ThenBy(u => u.DateNaissance.Day)
                .ToList();
            return Ok(users);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Utilisateur utilisateur)
        {
            if (id != utilisateur.id)
            {
                return BadRequest("L'identifiant de l'utilisateur ne correspond pas à l'identifiant de la requête.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            utilisateur.DateModif = DateTime.Now;
            utilisateur.MotDePasse = CryptoHelper.HashPassword(utilisateur.MotDePasse);
            _context.Entry(utilisateur).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UtilisateurExists(id))
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

        [HttpPost]
        public async Task<ActionResult<Utilisateur>> PostUtilisateur(Utilisateur utilisateur)
        {
            utilisateur.DateAjout = DateTime.Now;
            utilisateur.MotDePasse = CryptoHelper.HashPassword(utilisateur.MotDePasse); // hash le mot de passe
            if (DateTime.Now.Month == 5 && DateTime.Now.Day == 31)
            {
                utilisateur.JoursCongé = 26; // Reset the attribute to 26 on January 1st
            }
            else
            {
                utilisateur.JoursCongé = utilisateur.JoursCongé; // Use the existing value or set it to 26 if null
            }
            _context.Utilisateurs.Add(utilisateur);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUtilisateur), new { id = utilisateur.id }, utilisateur);
        }

        [HttpDelete("{id}")]
        public ActionResult<Utilisateur> DeleteUtilisateur(int id)
        {
            var utilisateur = _context.Utilisateurs.Find(id);
            if (utilisateur == null)
            {
                return NotFound();
            }

            utilisateur.Supprimé = true;
            _context.SaveChanges();

            return utilisateur;
        }

        private bool UtilisateurExists(int id)
        {
            return _context.Utilisateurs.Any(e => e.id == id);
        }

        [HttpGet("search/{searchTerm}")]
        public IActionResult SearchEmployees(string searchTerm)
        {
            // Perform input validation
            if (string.IsNullOrEmpty(searchTerm))
            {
                return BadRequest("Search term is required.");
            }

            try
            {
                // Perform the search query
                var searchResults = _context.Utilisateurs
                    .Where(u => !u.Supprimé &&
                        (u.Prenom + " " + u.Nom).Replace(" ", "").Contains(searchTerm.Replace(" ", "")))
                    .Include(e => e.Poste)
                    .ToList();

                return Ok(searchResults);
            }
            catch (Exception ex)
            {
                // Handle any potential exceptions
                return StatusCode(500, "An error occurred while searching employees.");
            }
        }

        // GET: api/Utilisateur/stats/role
        [HttpGet("stats/role")]
        public IActionResult GetUserByRole()
        {
            var userRoles = _context.Utilisateurs.Where(u => u.Supprimé == false)
                .GroupBy(u => u.Role)
                .Select(g => new { Role = g.Key, Count = g.Count() })
                .ToList();

            return Ok(userRoles);
        }

        // GET: api/Utilisateur/stats/departement
        [HttpGet("stats/departement")]
        public IActionResult GetUtilisateurByDepartement()
        {
            var utilisateurCountByDepartement = _context.Utilisateurs
                .Where(u => u.Supprimé == false)
                .GroupBy(u => u.DepartementId)
                .Select(g => new { Nom = _context.Départements.Where(d => d.id == g.Key).Select(d => d.Nom).FirstOrDefault(), Count = g.Count() })
                .ToList();

            return Ok(utilisateurCountByDepartement);
        }

        // GET: api/Utilisateur/stats/DateEmbauche
        [HttpGet("stats/DateEmbauche")]
        public IActionResult GetUtilisateurByDateEmbauche()
        {
            var UtilisateurCountByDateEmbauche = _context.Utilisateurs.Where(u => u.Supprimé == false)
                .GroupBy(u => new { Month = u.DateEmbauche.Month, Year = u.DateEmbauche.Year })
                .Select(g => new { MonthYear = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month) + " " + g.Key.Year.ToString(), Count = g.Count() })
                .ToList();

            return Ok(UtilisateurCountByDateEmbauche);
        }

        [HttpGet("statsCombine")]
        public IActionResult GetStatsCombine()
        {
            var startMonth = new DateTime(2022, 1, 1); // choisir une date de début appropriée
            var endMonth = DateTime.Now.Date; // ou choisir une date de fin appropriée

            var allMonths = Enumerable.Range(0, (endMonth.Year - startMonth.Year) * 12 + endMonth.Month - startMonth.Month + 1)
                .Select(offset => startMonth.AddMonths(offset))
                .Select(date => new { MonthYear = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(date.Month) + " " + date.Year.ToString() })
                .ToList();

            var usersByMonth = _context.Utilisateurs
                .Where(u => !u.Supprimé)
                .OrderBy(u => u.DateEmbauche)
                .GroupBy(u => new { Month = u.DateEmbauche.Month, Year = u.DateEmbauche.Year })
                .Select(u => new { MonthYear = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(u.Key.Month) + " " + u.Key.Year.ToString(), Count = u.Count() })
                .ToList();

            var totalUsers = 0;
            var usersByMonthWithZeros = allMonths
                .Select(m => usersByMonth.FirstOrDefault(u => u.MonthYear == m.MonthYear) ?? new { MonthYear = m.MonthYear, Count = 0 })
                .Select(u =>
                {
                    totalUsers += u.Count;
                    return new { MonthYear = u.MonthYear, Count = totalUsers };
                })
                .ToList();

            var mariéesByMonth = _context.MariageNaissances
                .Where(mn => mn.Titre == "Mariage")
                .OrderBy(mn => mn.Date)
                .GroupBy(mn => new { Month = mn.Date.Month, Year = mn.Date.Year })
                .Select(mn => new { MonthYear = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(mn.Key.Month) + " " + mn.Key.Year.ToString(), Count = mn.Count() })
                .ToList();

            var parentByMonth = _context.MariageNaissances
               .Where(nm => nm.Titre == "Naissance")
               .OrderBy(nm => nm.Date)
               .GroupBy(nm => new { Month = nm.Date.Month, Year = nm.Date.Year })
               .Select(nm => new { MonthYear = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(nm.Key.Month) + " " + nm.Key.Year.ToString(), Count = nm.Count() })
               .ToList();

            var statsByMonth = usersByMonthWithZeros
                .Select(u =>
                {
                    var countMariées = mariéesByMonth
                        .Where(m => DateTime.ParseExact(m.MonthYear, "MMMM yyyy", CultureInfo.CurrentCulture) <= DateTime.ParseExact(u.MonthYear, "MMMM yyyy", CultureInfo.CurrentCulture))
                        .Sum(m => m.Count);

                    var countParents = parentByMonth
                        .Where(n => DateTime.ParseExact(n.MonthYear, "MMMM yyyy", CultureInfo.CurrentCulture) <= DateTime.ParseExact(u.MonthYear, "MMMM yyyy", CultureInfo.CurrentCulture))
                        .Sum(n => n.Count);

                    var countCélibataires = u.Count - countMariées;

                    return new
                    {
                        MonthYear = u.MonthYear,
                        CountUsers = u.Count,
                        CountMariées = countMariées,
                        CountParents = countParents,
                        CountCélibataires = countCélibataires
                    };
                })
                .ToList();

            return Ok(statsByMonth);

        }

        [HttpGet("stats/data")]
        public IActionResult GetUtilisateurData()
        {
            var usersData = _context.Utilisateurs.Select(u => new
            {
                u.Salaire,
                Age = DateTime.Now.Year - u.DateNaissance.Year
            }).ToList();

            return Ok(usersData);
        }
    }
}