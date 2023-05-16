using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models
{
    public class SiteEvenement
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public int SiteId { get; set; }
        public Site Site { get; set; }
        public int EvenementId { get; set; }
        public Evenement Evenement { get; set; }
    }
}
