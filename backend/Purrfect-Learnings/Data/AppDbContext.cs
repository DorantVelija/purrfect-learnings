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

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User config
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<int>();

        // Assignment config: explicit PK and identity
        modelBuilder.Entity<Assignment>()
            .HasKey(a => a.AssignmentId);

        modelBuilder.Entity<Assignment>()
            .Property(a => a.AssignmentId)
            .ValueGeneratedOnAdd();

        // Assignment → Course relationship
        modelBuilder.Entity<Assignment>()
            .HasOne(a => a.Course)
            .WithMany()
            .HasForeignKey(a => a.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        // Composite primary key for AssignmentUser (UserId, AssignmentId)
        modelBuilder.Entity<AssignmentUser>()
            .HasKey(au => new { au.UserId, au.AssignmentId });

        modelBuilder.Entity<AssignmentUser>()
            .HasOne(au => au.Assignment)
            .WithMany(a => a.AssignmentUsers)
            .HasForeignKey(au => au.AssignmentId);

        modelBuilder.Entity<AssignmentUser>()
            .HasOne(au => au.User)
            .WithMany(u => u.AssignmentUsers)
            .HasForeignKey(au => au.UserId);

        // Composite primary key for UserCourse
        modelBuilder.Entity<UserCourse>()
            .HasKey(uc => new { uc.UserId, uc.CourseId });

        modelBuilder.Entity<UserCourse>()
            .HasOne(uc => uc.User)
            .WithMany(u => u.Courses)
            .HasForeignKey(uc => uc.UserId);

        modelBuilder.Entity<UserCourse>()
            .HasOne(uc => uc.Course)
            .WithMany(c => c.Users)
            .HasForeignKey(uc => uc.CourseId);

        modelBuilder.Entity<UserCourse>()
            .Property(uc => uc.JoinedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        modelBuilder.Entity<UserCourse>()
            .Property(uc => uc.Role)
            .HasConversion<int>();
        
        modelBuilder.Entity<Course>()
            .HasIndex(c => c.JoinCode)
            .IsUnique();
    }
}