using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace TelnetTeamBack.models
{
    public class Projet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Nom { get; set; }
        public string Description { get; set; }
        [JsonProperty("DateDébut")]
        [JsonConverter(typeof(IsoDateTimeConverter))]
        public DateTime DateDébut { get; set; }
        [JsonProperty("DateFin")]
        [JsonConverter(typeof(IsoDateTimeConverter))]
        public DateTime DateFin { get; set; }
        public float Budget { get; set; }
        public string UserAjout { get; set; }
        public ICollection<ProjectSuccess> ProjectSuccesses { get; set; }
    }
}
