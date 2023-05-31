using Newtonsoft.Json.Converters;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models
{
    public class Département
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Nom { get; set; }
        public int ChefD { get; set; }
        public ICollection<Utilisateur> Utilisateurs { get; set; }
        [ForeignKey("Site")]
        public int SiteId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Site Site { get; set; }
        [JsonProperty("DateAjout")]
        [Newtonsoft.Json.JsonConverter(typeof(IsoDateTimeConverter))]
        public DateTime DateAjout { get; set; }
        [JsonProperty("DateModif")]
        [Newtonsoft.Json.JsonConverter(typeof(IsoDateTimeConverter))]
        public DateTime DateModif { get; set; }
        public string UserAjout { get; set; }
        public string UserModif { get; set; }
        public ICollection<ProjectSuccess> ProjectSuccesses { get; set; }
    }
}
