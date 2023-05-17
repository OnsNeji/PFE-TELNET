using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TelnetTeamBack.models;

namespace TelnetTeamBack.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<Poste> Postes { get; set; }
        public DbSet<Département> Départements { get; set; }
        public DbSet<Site> Sites { get; set; }
        public DbSet<EmployéMois> EmployéMois { get; set; }
        public DbSet<Evenement> Evenements { get; set; }
        public DbSet<MédiaEvent> MediaEvents { get; set; }
        public DbSet<Convention> Conventions { get; set; }
        public DbSet<Nouveauté> Nouveautés { get; set; }
        public DbSet<Projet> Projets { get; set; }
        public DbSet<ProjectSuccess> ProjectSuccesses { get; set; }
        public DbSet<MariageNaissance> MariageNaissances { get; set; }
        public DbSet<Notification> notifications { get; set; }
        public DbSet<Demande> Demandes { get; set; }
        public DbSet<SiteEvenement> SiteEvenements { get; set; }
        public DbSet<Congé> Congés { get; set; }
        public DbSet<Historique> Historiques { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Utilisateur>()
            .HasOne(u => u.Poste)
            .WithOne(p => p.Utilisateur)
            .HasForeignKey<Poste>(p => p.UtilisateurId);

            modelBuilder.Entity<Utilisateur>()
                .HasOne(u => u.Département)
                .WithMany(d => d.Utilisateurs)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Site>()
               .HasMany(s => s.Départements)
               .WithOne(d => d.Site)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<EmployéMois>()
               .HasOne(e => e.Utilisateur)
               .WithMany(u => u.EmployéMois)
               .HasForeignKey(e => e.UtilisateurId)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Evenement>()
            .HasMany(e => e.MediaEvents)
            .WithOne(m => m.Evenement)
            .HasForeignKey(m => m.EvenementId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Nouveauté>()
                 .HasOne(p => p.Site)
                 .WithMany(p => p.Nouveautés)
                 .HasForeignKey(p => p.SiteId);

            modelBuilder.Entity<Projet>()
                .HasMany(p => p.ProjectSuccesses)
                .WithOne(ps => ps.Projet)
                .HasForeignKey(ps => ps.ProjetId);

            modelBuilder.Entity<MariageNaissance>()
                .HasOne(m => m.Utilisateur)
                .WithMany(u => u.MariageNaissances)
                .HasForeignKey(m => m.UtilisateurId);

            modelBuilder.Entity<Convention>()
                .HasOne(c => c.Notification)
                .WithOne(n => n.Convention)
                .HasForeignKey<Notification>(n => n.ConventionId);

            modelBuilder.Entity<Nouveauté>()
                .HasOne(c => c.Notification)
                .WithOne(n => n.Nouveauté)
                .HasForeignKey<Notification>(n => n.NouveautéId);

            modelBuilder.Entity<Evenement>()
                .HasOne(c => c.Notification)
                .WithOne(n => n.Evenement)
                .HasForeignKey<Notification>(n => n.EvenementId);

            modelBuilder.Entity<EmployéMois>()
                .HasOne(c => c.Notification)
                .WithOne(n => n.EmployéMois)
                .HasForeignKey<Notification>(n => n.EmployéMoisId);

            modelBuilder.Entity<Poste>()
                .HasOne(p => p.Site)
                .WithMany(s => s.Postes)
                .HasForeignKey(p => p.SiteId);

            modelBuilder.Entity<Demande>()
                .HasOne(d => d.Utilisateur)
                .WithMany(u => u.Demandes)
                .HasForeignKey(d => d.UtilisateurId);

            modelBuilder.Entity<Demande>()
                .HasOne(d => d.Admin)
                .WithMany(u => u.AdminDemandes)
                .HasForeignKey(d => d.AdminId);

            modelBuilder.Entity<SiteEvenement>()
                .HasKey(se => new { se.SiteId, se.EvenementId });

            modelBuilder.Entity<SiteEvenement>()
                .HasOne(se => se.Site)
                .WithMany(s => s.SiteEvenements)
                .HasForeignKey(se => se.SiteId);

            modelBuilder.Entity<SiteEvenement>()
                .HasOne(se => se.Evenement)
                .WithMany(e => e.SiteEvenements)
                .HasForeignKey(se => se.EvenementId);

            modelBuilder.Entity<Congé>()
                .HasOne(d => d.Utilisateur)
                .WithMany(u => u.Congés)
                .HasForeignKey(d => d.UtilisateurId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Demande>()
                .HasMany(d => d.Historiques)
                .WithOne(h => h.Demande)
                .HasForeignKey(h => h.DemandeId);

        }

    }


}
