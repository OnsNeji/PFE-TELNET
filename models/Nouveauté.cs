using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models
{
    public class Nouveauté
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Titre { get; set; }
        public string Description { get; set; }
        public string PieceJointe { get; set; }
        public DateTime DatePublication { get; set; }
        public string UserAjout { get; set; }
        public int SiteId { get; set; }
        public Site Site { get; set; }
        public Notification Notification { get; set; }
    }
}
