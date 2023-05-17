using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace TelnetTeamBack.models
{
    public class Demande
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Titre { get; set; }
        public string Description { get; set; }
        public string Priorite { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public string Document { get; set; }
        public DateTime? Mois { get; set; }
        public string Motif { get; set; }
        public string Destinataire { get; set; }
        public DateTime? DateSortie { get; set; }
        public string Type { get; set; }
        public DateTime? DateDebut { get; set; }
        public DateTime? DateFin { get; set; }
        public string Justificatif { get; set; }
        public string Police { get; set; }
        public int UtilisateurId { get; set; }
        [JsonIgnore]
        public Utilisateur Utilisateur { get; set; }
        public int? AdminId { get; set; }
        [JsonIgnore]
        public Utilisateur Admin { get; set; }
        public ICollection<Historique> Historiques { get; set; }
    }
}
