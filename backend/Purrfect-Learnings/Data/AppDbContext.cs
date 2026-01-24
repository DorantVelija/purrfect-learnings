using Microsoft.EntityFrameworkCore;
using Purrfect_Learnings.Models;

namespace Purrfect_Learnings.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<UserCourse> UserCourses { get; set; }
    public DbSet<Assignment> Assignments { get; set; }
    public DbSet<AssignmentUser> AssignmentUsers { get; set; }
}