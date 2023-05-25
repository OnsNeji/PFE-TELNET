using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace TelnetTeamBack.models
{
    public class Convention
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Titre { get; set; }
        public string Logo { get; set; }
        public DateTime DateDebut { get; set; }
        public DateTime DateFin { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string PieceJointe { get; set; }
        public string UserAjout { get; set; }
        public Notification Notification { get; set; }
        public int CatégorieId { get; set; }
        [JsonIgnore]
        public Catégorie Catégorie { get; set; }
        public string Zone { get; set; }
    }
}
