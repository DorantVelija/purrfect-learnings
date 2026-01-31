using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Purrfect_Learnings.Models;

public enum Role
{
    Admin,
    Teacher,
    Student
}

public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PasswordHash { get; set; } =  string.Empty;
    public string Email { get; set; } = string.Empty;
    public Role Role { get; set; }
    public string? ProfilePictureUrl { get; set; }
    
    // for naviation
    public ICollection<UserCourse> Courses { get; set; } = new List<UserCourse>();
    public ICollection<AssignmentUser> AssignmentUsers { get; set; } = new List<AssignmentUser>();
}

public class UserCourse
{
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Role Role { get; set; }
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}