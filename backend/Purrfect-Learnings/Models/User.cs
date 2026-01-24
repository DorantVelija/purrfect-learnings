namespace Purrfect_Learnings.Models;

public enum Role
{
    Admin,
    Teacher,
    Student
}

public class User
{
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public Role Role { get; set; }
    public string? ProfilePictureUrl { get; set; }
    
    // for naviation
    public ICollection<UserCourse> Courses { get; set; } = new List<UserCourse>();
    public ICollection<AssignmentUser> AssignmentUsers { get; set; } = new List<AssignmentUser>();
}

public class UserCourse
{
    public int CourseId { get; set; }
    public Course Course { get; set; }
    
    public int UserId { get; set; }
    public User User { get; set; }
    
    public Role Role { get; set; }
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}