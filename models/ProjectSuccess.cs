using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models
{
    public class ProjectSuccess
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Titre { get; set; }
        public string Description { get; set; }
        public string PieceJointe { get; set; }
        public string UserAjout { get; set; }
        public int ProjetId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Projet Projet { get; set; }
    }
}
