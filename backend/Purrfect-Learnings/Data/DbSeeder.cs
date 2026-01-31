using Purrfect_Learnings.Data;
using Purrfect_Learnings.Models;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (context.Users.Any())
            return;

        /* =========================
         * USERS
         * ========================= */
        var student = new User
        {
            UserId = 1,
            Name = "Student Kitty",
            Email = "student@purrfect.dev",
            Role = Role.Student
        };

        var teacher = new User
        {
            UserId = 2,
            Name = "Teacher Cat",
            Email = "teacher@purrfect.dev",
            Role = Role.Teacher
        };

        context.Users.AddRange(student, teacher);
        await context.SaveChangesAsync();

        /* =========================
         * COURSES
         * ========================= */
        var course = new Course
        {
            Id = 1,
            Name = "Kitty Math",
            Description = "Numbers & paws"
        };

        context.Courses.Add(course);
        await context.SaveChangesAsync();

        /* =========================
         * USER ↔ COURSE (JOIN)
         * ========================= */
        context.UserCourses.AddRange(
            new UserCourse
            {
                UserId = student.UserId,
                CourseId = course.Id,
                Role = Role.Student
            },
            new UserCourse
            {
                UserId = teacher.UserId,
                CourseId = course.Id,
                Role = Role.Teacher
            }
        );

        await context.SaveChangesAsync();

        /* =========================
         * ASSIGNMENTS
         * ========================= */
        var assignment1 = new Assignment
        {
            AssignmentId = 1,
            CourseId = course.Id,
            AssignmentName = "Homework 1",
            DueDate = DateTime.UtcNow.AddDays(3)
        };

        var assignment2 = new Assignment
        {
            AssignmentId = 2,
            CourseId = course.Id,
            AssignmentName = "Perfect Paws Project",
            DueDate = DateTime.UtcNow.AddDays(7)
        };

        context.Assignments.AddRange(assignment1, assignment2);
        await context.SaveChangesAsync();

        /* =========================
         * ASSIGNMENT ↔ USER
         * ========================= */
        context.AssignmentUsers.AddRange(
            new AssignmentUser
            {
                UserId = student.UserId,
                AssignmentId = assignment1.AssignmentId,
                SubmittedAt = DateTime.UtcNow,
                Grade = 100
            },
            new AssignmentUser
            {
                UserId = student.UserId,
                AssignmentId = assignment2.AssignmentId,
                SubmittedAt = null,
                Grade = null
            }
        );

        await context.SaveChangesAsync();
    }
}