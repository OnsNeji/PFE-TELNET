using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TelnetTeamBack.Context;

namespace TelnetTeamBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConnectionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConnectionController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        [HttpPost]
        public async Task<IActionResult> Delete(string signalrId)
        {
            var connection = await _context.Connections.SingleOrDefaultAsync(c => c.SignalrId == signalrId);

            if (connection != null)
            {
                _context.Connections.Remove(connection);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

    }
}
