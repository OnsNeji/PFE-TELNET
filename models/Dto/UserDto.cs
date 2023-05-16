using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models.Dto
{
    public class UserDto
    {
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string MotDePasse { get; set; }
    }

    public class User
    {
        public int id { get; set; }
        public string nom { get; set; }
        public string prenom { get; set; }
        public string signalrId { get; set; } //signalrId

        public User(int someId, string someNom, string somePrenom, string someSignalrId)
        {
            id = someId;
            nom = someNom;
            prenom = somePrenom;
            signalrId = someSignalrId;
        }
    }
}
