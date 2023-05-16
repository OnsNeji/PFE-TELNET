using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace TelnetTeamBack.models
{
    public class EmployéMois
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public DateTime date { get; set; }
        public string Description { get; set; }
        public string UserAjout { get; set; }
        public string Image { get; set; }
        public int UtilisateurId { get; set; }
        [JsonIgnore]
        public Utilisateur Utilisateur { get; set; }
        public Notification Notification { get; set; }

    }
}
