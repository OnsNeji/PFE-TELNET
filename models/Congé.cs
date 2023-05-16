using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace TelnetTeamBack.models
{
    public class Congé
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateDebut { get; set; }
        public int Duree { get; set; }
        public string Status { get; set; }
        public string Justificatif { get; set; }
        public string Document { get; set; }
        public int UtilisateurId { get; set; }
        [JsonIgnore]
        public Utilisateur Utilisateur { get; set; }
    }
}
