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
    public class DépartementController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DépartementController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        // GET: api/Departement
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Département>>> GetDepartements()
        {
            return await _context.Départements.Include(e => e.Utilisateurs).Include(e => e.Site).Include(e => e.ProjectSuccesses).ToListAsync();
        }

        // GET: api/Departement/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Département>> GetDepartement(int id)
        {
            var departement = await _context.Départements.Include(e => e.Utilisateurs).Include(e => e.Site).FirstOrDefaultAsync(e => e.id == id);

            if (departement == null)
            {
                return NotFound();
            }

            return departement;
        }

        // POST: api/Departement
        [HttpPost]
        public async Task<ActionResult<Département>> PostDepartement(Département departement)
        {
            departement.DateAjout = DateTime.Now;
            _context.Départements.Add(departement);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDepartement), new { id = departement.id }, departement);
        }

        // PUT: api/Departement/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Département departement)
        {
            if (id != departement.id)
            {
                return BadRequest("L'identifiant du departement ne correspond pas à l'identifiant de la requête.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            departement.DateModif = DateTime.Now;
            _context.Entry(departement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartementExists(id))
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

        // DELETE: api/Departement/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartement(int id)
        {
            var departement = await _context.Départements.FindAsync(id);
            if (departement == null)
            {
                return NotFound();
            }

            _context.Départements.Remove(departement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DepartementExists(int id)
        {
            return _context.Départements.Any(e => e.id == id);
        }
    }
}
