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
    public class MariageNaissanceController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MariageNaissanceController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MariageNaissance>>> GetMariageNaissances()
        {
            return await _context.MariageNaissances.Include(m => m.Utilisateur).Where(m => m.Utilisateur.Supprimé == false).ToListAsync();
                       
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MariageNaissance>> GetMariageNaissance(int id)
        {
            var mariageNaissance = await _context.MariageNaissances.FindAsync(id);

            if (mariageNaissance == null)
            {
                return NotFound();
            }

            return mariageNaissance;
        }

        [HttpPost]
        public async Task<ActionResult<MariageNaissance>> PostMariageNaissance(MariageNaissance mariageNaissance)
        {
            _context.MariageNaissances.Add(mariageNaissance);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMariageNaissance), new { id = mariageNaissance.id }, mariageNaissance);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMariageNaissance(int id, [FromBody] MariageNaissance mariageNaissance)
        {
            if (id != mariageNaissance.id)
            {
                return BadRequest();
            }

            _context.Entry(mariageNaissance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MariageNaissanceExists(id))
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
        public async Task<IActionResult> DeleteMariageNaissance(int id)
        {
            var mariageNaissance = await _context.MariageNaissances.FindAsync(id);
            if (mariageNaissance == null)
            {
                return NotFound();
            }

            _context.MariageNaissances.Remove(mariageNaissance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MariageNaissanceExists(int id)
        {
            return _context.MariageNaissances.Any(e => e.id == id);
        }
    }
}
