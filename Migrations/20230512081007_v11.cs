using Microsoft.EntityFrameworkCore.Migrations;

namespace TelnetTeamBack.Migrations
{
    public partial class v11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Utilisateurs_Départements_DepartementId",
                table: "Utilisateurs");

            migrationBuilder.DropIndex(
                name: "IX_Utilisateurs_DepartementId",
                table: "Utilisateurs");

            migrationBuilder.AddColumn<int>(
                name: "Départementid",
                table: "Utilisateurs",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_Départementid",
                table: "Utilisateurs",
                column: "Départementid");

            migrationBuilder.AddForeignKey(
                name: "FK_Utilisateurs_Départements_Départementid",
                table: "Utilisateurs",
                column: "Départementid",
                principalTable: "Départements",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Utilisateurs_Départements_Départementid",
                table: "Utilisateurs");

            migrationBuilder.DropIndex(
                name: "IX_Utilisateurs_Départementid",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "Départementid",
                table: "Utilisateurs");

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_DepartementId",
                table: "Utilisateurs",
                column: "DepartementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Utilisateurs_Départements_DepartementId",
                table: "Utilisateurs",
                column: "DepartementId",
                principalTable: "Départements",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
