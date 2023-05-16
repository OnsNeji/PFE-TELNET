using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models
{
    public class Connection
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public int utilisateurId { get; set; }
        public Utilisateur Utilisateur { get; set; }
        public string SignalrId { get; set; }
        public DateTime ConnectedAt { get; set; }
    }
}
