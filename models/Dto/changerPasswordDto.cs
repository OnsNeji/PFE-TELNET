using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models.Dto
{
    public class changerPasswordDto
    {
        public string MotDePasseActuel { get; set; }
        public string NouveauMotDePasse { get; set; }
        public string ConfirmerNouveauMotDePasse { get; set; }
    }
}
