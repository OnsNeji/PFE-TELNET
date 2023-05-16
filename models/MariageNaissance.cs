using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TelnetTeamBack.models
{
    public class MariageNaissance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Titre { get; set; }
        public DateTime Date { get; set; }
        public string MessageVoeux { get; set; }
        public string UserAjout { get; set; }
        public int UtilisateurId { get; set; }
        [JsonIgnore]
        public Utilisateur Utilisateur { get; set; }

    }
}
