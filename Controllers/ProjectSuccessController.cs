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
    public class ProjectSuccessController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectSuccessController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ProjectSuccess
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectSuccess>>> GetProjectSuccesses()
        {
            return await _context.ProjectSuccesses.ToListAsync();
        }

        // GET: api/ProjectSuccess/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectSuccess>> GetProjectSuccess(int id)
        {
            var projectSuccess = await _context.ProjectSuccesses.FindAsync(id);

            if (projectSuccess == null)
            {
                return NotFound();
            }

            return projectSuccess;
        }

        // PUT: api/ProjectSuccess/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectSuccess(int id, [FromBody] ProjectSuccess projectSuccess)
        {
            if (id != projectSuccess.id)
            {
                return BadRequest("The project success ID in the request does not match the ID in the project success data.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(projectSuccess).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectSuccessExists(id))
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

        // POST: api/ProjectSuccess
        [HttpPost]
        public async Task<ActionResult<ProjectSuccess>> PostProjectSuccess(ProjectSuccess projectSuccess)
        {
            _context.ProjectSuccesses.Add(projectSuccess);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectSuccess), new { id = projectSuccess.id }, projectSuccess);
        }

        // DELETE: api/ProjectSuccess/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectSuccess(int id)
        {
            var projectSuccess = await _context.ProjectSuccesses.FindAsync(id);
            if (projectSuccess == null)
            {
                return NotFound();
            }

            _context.ProjectSuccesses.Remove(projectSuccess);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectSuccessExists(int id)
        {
            return _context.ProjectSuccesses.Any(e => e.id == id);
        }

    }
}
