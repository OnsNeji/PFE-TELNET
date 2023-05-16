using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models.Dto
{
    public class MessageDto
    {
        public int senderId { get; set; }
        public int ConversationId { get; set; }
        public string message { get; set; }
    }
}
