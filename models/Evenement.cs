using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models
{
    public class Evenement
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Titre { get; set; }
        public string Description { get; set; }
        public DateTime DateEvent { get; set; }
        public string UserAjout { get; set; }
        public string Lien { get; set; }
        public ICollection<MédiaEvent> MediaEvents { get; set; }
        public Notification Notification { get; set; }
        public ICollection<SiteEvenement> SiteEvenements { get; set; }
    }
}
