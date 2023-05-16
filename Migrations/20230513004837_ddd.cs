using Microsoft.EntityFrameworkCore.Migrations;

namespace TelnetTeamBack.Migrations
{
    public partial class ddd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AdminId",
                table: "Demandes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Demandes_AdminId",
                table: "Demandes",
                column: "AdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_Demandes_Utilisateurs_AdminId",
                table: "Demandes",
                column: "AdminId",
                principalTable: "Utilisateurs",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Demandes_Utilisateurs_AdminId",
                table: "Demandes");

            migrationBuilder.DropIndex(
                name: "IX_Demandes_AdminId",
                table: "Demandes");

            migrationBuilder.DropColumn(
                name: "AdminId",
                table: "Demandes");
        }
    }
}
