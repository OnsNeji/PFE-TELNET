using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace TelnetTeamBack.models
{
    public class MédiaEvent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string PieceJointe { get; set; }
        public int EvenementId { get; set; }
        [JsonIgnore]
        public Evenement Evenement { get; set; }
    }
}
