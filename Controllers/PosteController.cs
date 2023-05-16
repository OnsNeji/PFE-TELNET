using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class PosteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PosteController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        // GET: api/Poste
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Poste>>> Get()
        {
            return await _context.Postes.ToListAsync();
        }

        // GET: api/Poste/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Poste>> Get(int id)
        {
            var poste = await _context.Postes.FindAsync(id);

            if (poste == null)
            {
                return NotFound();
            }

            return poste;
        }

        // POST: api/Poste
        //[HttpPost]
        //public async Task<ActionResult<Poste>> Post(Poste poste)
        //{

        //    poste.DateAjout = DateTime.Now;
        //    _context.Postes.Add(poste);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction(nameof(Get), new { id = poste.id }, poste);
        //}

        [HttpPost]
        public async Task<ActionResult<Poste>> Post(Poste poste)
        {
            poste.DateAjout = DateTime.Now;

            // Trouver l'utilisateur correspondant à ce poste
            Utilisateur utilisateur = await _context.Utilisateurs.FindAsync(poste.UtilisateurId);

            // Trouver le département correspondant à cet utilisateur
            Département departement = await _context.Départements.FindAsync(utilisateur.DepartementId);

            // Définir l'ID de site du poste sur celui du département
            poste.SiteId = departement.SiteId;

            // Ajouter le nouveau poste à la base de données
            _context.Postes.Add(poste);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = poste.id }, poste);
        }


        // PUT: api/Poste/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Poste poste)
        {
            if (id != poste.id)
            {
                return BadRequest("L'identifiant du poste ne correspond pas à l'identifiant de la requête.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            poste.DateModif = DateTime.Now;

            Utilisateur utilisateur = await _context.Utilisateurs.FindAsync(poste.UtilisateurId);

            // Trouver le département correspondant à cet utilisateur
            Département departement = await _context.Départements.FindAsync(utilisateur.DepartementId);

            // Définir l'ID de site du poste sur celui du département
            poste.SiteId = departement.SiteId;
            _context.Entry(poste).State = EntityState.Modified;


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PosteExists(id))
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

        // DELETE: api/Poste/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var poste = await _context.Postes.FindAsync(id);

            if (poste == null)
            {
                return NotFound();
            }

            _context.Postes.Remove(poste);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PosteExists(int id)
        {
            return _context.Postes.Any(p => p.id == id);
        }
    }
}