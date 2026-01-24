namespace Purrfect_Learnings.Models;

public class Course
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }
    
    // for naviation
    public ICollection<UserCourse> Users { get; set; } = new List<UserCourse>();
}

public class Assignment
{
    public int AssignmentId { get; set; }
    public string AssignmentName { get; set; }
    public string AssignmentDescription { get; set; }

    public int CourseId { get; set; }
    public Course Course { get; set; }
    
    // for naviation
    public ICollection<AssignmentUser> AssignmentUsers { get; set; } = new List<AssignmentUser>();
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }
    public DateTime DueDate { get; set; }
}

public class AssignmentUser
{
    public int AssignmentId { get; set; }
    public Assignment Assignment { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public DateTime AssignedAt { get; set; }
    public DateTime SubmittedAt { get; set; }
    public decimal? Grade { get; set; }
}