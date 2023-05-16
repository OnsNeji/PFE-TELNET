using Newtonsoft.Json.Converters;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models
{
    public class Site
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string site { get; set; }
        public string adresse { get; set; }
        public string tel { get; set; }
        public string fax { get; set; }
        public ICollection<Département> Départements { get; set; }

        [JsonProperty("DateAjout")]
        [JsonConverter(typeof(IsoDateTimeConverter))]
        public DateTime DateAjout { get; set; }
        [JsonProperty("DateModif")]
        [JsonConverter(typeof(IsoDateTimeConverter))]
        public DateTime DateModif { get; set; }
        public string UserAjout { get; set; }
        public string UserModif { get; set; }
        public ICollection<Nouveauté> Nouveautés { get; set; }
        public ICollection<Poste> Postes { get; set; }
        public ICollection<SiteEvenement> SiteEvenements { get; set; }
    }
}
