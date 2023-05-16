using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;

namespace TelnetTeamBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjetController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjetController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Projet
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Projet>>> GetProjets()
        {
            return await _context.Projets.Include(e => e.ProjectSuccesses).ToListAsync();
        }

        // GET: api/Projet/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Projet>> GetProjet(int id)
        {
            var projet = await _context.Projets.Include(e => e.ProjectSuccesses).FirstOrDefaultAsync(e => e.id == id);

            if (projet == null)
            {
                return NotFound();
            }

            return projet;
        }

        // PUT: api/Projet/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjet(int id, [FromBody] Projet projet)
        {
            if (id != projet.id)
            {
                return BadRequest("L'identifiant du projet ne correspond pas à l'identifiant de la requête.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(projet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjetExists(id))
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

        // POST: api/Projet
        [HttpPost]
        public async Task<ActionResult<Projet>> PostProjet(Projet projet)
        {
            _context.Projets.Add(projet);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjet), new { id = projet.id }, projet);
        }

        // DELETE: api/Projet/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjet(int id)
        {
            var projet = await _context.Projets.FindAsync(id);
            if (projet == null)
            {
                return NotFound();
            }

            _context.Projets.Remove(projet);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjetExists(int id)
        {
            return _context.Projets.Any(e => e.id == id);
        }

    }
}
