using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models
{
    public class Message
    {
        public int id { get; set; }
        public string message { get; set; }
        public DateTime date { get; set; }

        public int senderId { get; set; }
        public Utilisateur Sender { get; set; }
    }
}
