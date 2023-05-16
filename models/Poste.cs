using Newtonsoft.Json.Converters;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;


namespace TelnetTeamBack.models
{
    public class Poste
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public int Numéro { get; set; }
        public int UtilisateurId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Utilisateur Utilisateur { get; set; }
        [JsonProperty("DateAjout")]
        [Newtonsoft.Json.JsonConverter(typeof(IsoDateTimeConverter))]
        public DateTime DateAjout { get; set; }
        [JsonProperty("DateModif")]
        [Newtonsoft.Json.JsonConverter(typeof(IsoDateTimeConverter))]
        public DateTime DateModif { get; set; }
        public string UserAjout { get; set; }
        public string UserModif { get; set; }
        public string Etage { get; set; }
        public int SiteId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Site Site { get; set; }
    }
}
