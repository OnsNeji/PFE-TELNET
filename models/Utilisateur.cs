
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.models
{
    public class Utilisateur
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Sexe { get; set; }
        public string Matricule { get; set; }
        public DateTime DateEmbauche { get; set; }
        public string Email { get; set; }
        public string MotDePasse { get; set; }
        public string Tel { get; set; }
        public DateTime DateNaissance { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public string ResetPasswordToken { get; set; }
        public DateTime ResetPasswordExpiry { get; set; }
        public string Image { get; set; }
        public int DepartementId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Département Département { get; set; }
        public Poste Poste { get; set; }
        public Boolean Supprimé { get; set; }
        [JsonProperty("DateAjout")]
        [Newtonsoft.Json.JsonConverter(typeof(IsoDateTimeConverter))]
        public DateTime DateAjout { get; set; }
        [JsonProperty("DateModif")]
        [Newtonsoft.Json.JsonConverter(typeof(IsoDateTimeConverter))]
        public DateTime DateModif { get; set; }
        public string UserAjout { get; set; }
        public string UserModif { get; set; }
        public ICollection<EmployéMois> EmployéMois { get; set; }
        public List<MariageNaissance> MariageNaissances { get; set; }
        public ICollection<Demande> Demandes { get; set; }
        public ICollection<Demande> AdminDemandes { get; set; }
        public int JoursCongé { get; set; }
        public List<Congé> Congés { get; set; }

    }
}
