using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace TelnetTeamBack.models
{
    public class Historique
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Etat { get; set; }
        public DateTime DateEtat { get; set; }
        public int DemandeId { get; set; }
        [JsonIgnore]
        public Demande Demande { get; set; }
    }
}
