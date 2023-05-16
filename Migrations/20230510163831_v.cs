using Microsoft.EntityFrameworkCore.Migrations;

namespace TelnetTeamBack.Migrations
{
    public partial class v : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Sexe",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "id",
                table: "SiteEvenements",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Sexe",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "id",
                table: "SiteEvenements");
        }
    }
}
