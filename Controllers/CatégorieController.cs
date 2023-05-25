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
    public class CatégorieController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CatégorieController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Catégorie
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Catégorie>>> GetCatégories()
        {
            return await _context.Catégories.Include(c => c.Conventions).ToListAsync();
        }

        // GET: api/Catégorie/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Catégorie>> GetCatégorie(int id)
        {
            var catégorie = await _context.Catégories.Include(c => c.Conventions).FirstOrDefaultAsync(c => c.id == id);

            if (catégorie == null)
            {
                return NotFound();
            }

            return catégorie;
        }

        // PUT: api/Catégorie/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCatégorie(int id, Catégorie catégorie)
        {
            if (id != catégorie.id)
            {
                return BadRequest("L'identifiant de la catégorie ne correspond pas à l'identifiant de la requête.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(catégorie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CatégorieExists(id))
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

        // POST: api/Catégorie
        [HttpPost]
        public async Task<ActionResult<Catégorie>> PostCatégorie(Catégorie catégorie)
        {
            _context.Catégories.Add(catégorie);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCatégorie), new { id = catégorie.id }, catégorie);
        }

        // DELETE: api/Catégorie/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCatégorie(int id)
        {
            var catégorie = await _context.Catégories.FindAsync(id);
            if (catégorie == null)
            {
                return NotFound();
            }

            _context.Catégories.Remove(catégorie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CatégorieExists(int id)
        {
            return _context.Catégories.Any(c => c.id == id);
        }
    }
}
