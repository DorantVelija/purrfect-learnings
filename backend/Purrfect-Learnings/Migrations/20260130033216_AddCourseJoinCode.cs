using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Purrfect_Learnings.Migrations
{
    /// <inheritdoc />
    public partial class AddCourseJoinCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "JoinCode",
                table: "Courses",
                type: "character varying(9)",
                maxLength: 9,
                nullable: true
            );

            
            migrationBuilder.Sql("""
                UPDATE "Courses"
                SET "JoinCode" = substring(
                    upper(md5(random()::text)),
                    1, 9
                )
                WHERE "JoinCode" IS NULL;
            """);

            
            migrationBuilder.AlterColumn<string>(
                name: "JoinCode",
                table: "Courses",
                type: "character varying(9)",
                maxLength: 9,
                nullable: false
            );

            // 4) Add UNIQUE index
            migrationBuilder.CreateIndex(
                name: "IX_Courses_JoinCode",
                table: "Courses",
                column: "JoinCode",
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Courses_JoinCode",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "JoinCode",
                table: "Courses");
        }
    }
}
