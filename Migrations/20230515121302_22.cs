using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TelnetTeamBack.Migrations
{
    public partial class _22 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateDebut",
                table: "Demandes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateFin",
                table: "Demandes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Justificatif",
                table: "Demandes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Police",
                table: "Demandes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Demandes",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateDebut",
                table: "Demandes");

            migrationBuilder.DropColumn(
                name: "DateFin",
                table: "Demandes");

            migrationBuilder.DropColumn(
                name: "Justificatif",
                table: "Demandes");

            migrationBuilder.DropColumn(
                name: "Police",
                table: "Demandes");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Demandes");
        }
    }
}
