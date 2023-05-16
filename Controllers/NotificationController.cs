using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;

namespace TelnetTeamBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/notification
        [HttpGet]
        public ActionResult<IEnumerable<Notification>> GetNotifications()
        {
            return _context.notifications.OrderByDescending(u => u.Date).Take(10).ToList();
        }

        // GET: api/notification/todaycount
        [HttpGet("todaycount")]
        public ActionResult<int> GetTodayNotificationsCount()
        {
            var today = DateTime.Today;
            var count = _context.notifications.Count(n => n.Date.Date == DateTime.Today.Date);
            return count;
        }
    }
}
