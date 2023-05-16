using Microsoft.EntityFrameworkCore.Migrations;

namespace TelnetTeamBack.Migrations
{
    public partial class _11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Demandes_Utilisateurs_AdminId",
                table: "Demandes");

            migrationBuilder.AlterColumn<int>(
                name: "AdminId",
                table: "Demandes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Demandes_Utilisateurs_AdminId",
                table: "Demandes",
                column: "AdminId",
                principalTable: "Utilisateurs",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Demandes_Utilisateurs_AdminId",
                table: "Demandes");

            migrationBuilder.AlterColumn<int>(
                name: "AdminId",
                table: "Demandes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Demandes_Utilisateurs_AdminId",
                table: "Demandes",
                column: "AdminId",
                principalTable: "Utilisateurs",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
