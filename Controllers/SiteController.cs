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
    public class SiteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SiteController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        // GET: api/Site
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Site>>> GetSites()
        {
            return await _context.Sites.Include(e => e.Départements).Include(e => e.Postes).ToListAsync();
        }

        // GET: api/Site/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Site>> GetSite(int id)
        {
            var site = await _context.Sites.Include(e => e.Départements).Include(e => e.Postes).FirstOrDefaultAsync(e => e.id == id);

            if (site == null)
            {
                return NotFound();
            }

            return site;
        }

        // PUT: api/Site/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Site site)
        {
            if (id != site.id)
            {
                return BadRequest("L'identifiant du site ne correspond pas à l'identifiant de la requête.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            site.DateModif = DateTime.Now;
            _context.Entry(site).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SiteExists(id))
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

        // POST: api/Site
        [HttpPost]
        public async Task<ActionResult<Site>> PostSite(Site site)
        {
            site.DateAjout = DateTime.Now;
            _context.Sites.Add(site);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSite), new { id = site.id }, site);
        }

        // DELETE: api/Site/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSite(int id)
        {
            var site = await _context.Sites.FindAsync(id);
            if (site == null)
            {
                return NotFound();
            }

            _context.Sites.Remove(site);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SiteExists(int id)
        {
            return _context.Sites.Any(e => e.id == id);
        }
    }
}