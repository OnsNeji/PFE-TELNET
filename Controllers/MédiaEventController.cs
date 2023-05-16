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
    public class MédiaEventController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MédiaEventController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MédiaEvent>>> GetMediaEvents()
        {
            return await _context.MediaEvents.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MédiaEvent>> GetMediaEvent(int id)
        {
            var mediaEvent = await _context.MediaEvents.FindAsync(id);

            if (mediaEvent == null)
            {
                return NotFound();
            }

            return mediaEvent;
        }

        [HttpPost]
        public async Task<ActionResult<MédiaEvent>> CreateMediaEvent(MédiaEvent mediaEvent)
        {
            _context.MediaEvents.Add(mediaEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMediaEvent), new { id = mediaEvent.id }, mediaEvent);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMediaEvent(int id, [FromBody] MédiaEvent mediaEvent)
        {
            if (id != mediaEvent.id)
            {
                return BadRequest();
            }

            _context.Entry(mediaEvent).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MediaEventExists(id))
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
        public async Task<IActionResult> DeleteMediaEvent(int id)
        {
            var mediaEvent = await _context.MediaEvents.FindAsync(id);
            if (mediaEvent == null)
            {
                return NotFound();
            }

            _context.MediaEvents.Remove(mediaEvent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MediaEventExists(int id)
        {
            return _context.MediaEvents.Any(e => e.id == id);
        }
    }
}
