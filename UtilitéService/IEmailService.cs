using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TelnetTeamBack.models;

namespace TelnetTeamBack.UtilitéService
{
    public interface IEmailService
    {
        void SendEmail(EmailModel emailModel);
    }
}
