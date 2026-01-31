using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Purrfect_Learnings.Migrations
{
    /// <inheritdoc />
    public partial class FixAssignmentsAndJoins : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AssignmentUsers",
                table: "AssignmentUsers");

            migrationBuilder.DropIndex(
                name: "IX_AssignmentUsers_UserId",
                table: "AssignmentUsers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AssignmentUsers",
                table: "AssignmentUsers",
                columns: new[] { "UserId", "AssignmentId" });

            migrationBuilder.CreateIndex(
                name: "IX_AssignmentUsers_AssignmentId",
                table: "AssignmentUsers",
                column: "AssignmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AssignmentUsers",
                table: "AssignmentUsers");

            migrationBuilder.DropIndex(
                name: "IX_AssignmentUsers_AssignmentId",
                table: "AssignmentUsers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AssignmentUsers",
                table: "AssignmentUsers",
                columns: new[] { "AssignmentId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AssignmentUsers_UserId",
                table: "AssignmentUsers",
                column: "UserId");
        }
    }
}
