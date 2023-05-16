using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public string UserAjout { get; set; }
        public int? ConventionId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Convention Convention { get; set; }
        public int? NouveautéId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Nouveauté Nouveauté { get; set; }
        public int? EvenementId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Evenement Evenement { get; set; }
        public int? EmployéMoisId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public EmployéMois EmployéMois { get; set; }
    }
}
