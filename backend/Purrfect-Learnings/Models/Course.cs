using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;
using System.Text;

namespace Purrfect_Learnings.Models;

public class Course
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime Updated { get; set; } = DateTime.UtcNow;
    
    // for navigation
    public ICollection<UserCourse> Users { get; set; } = new List<UserCourse>();

    [Required]
    [StringLength(9)]
    public string JoinCode { get; set; } = GenerateJoinCode();

    private static string GenerateJoinCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var bytes = new byte[9];
        RandomNumberGenerator.Fill(bytes);

        var sb = new StringBuilder(9);
        for (int i = 0; i < 9; i++)
        {
            sb.Append(chars[bytes[i] % chars.Length]);
        }

        return sb.ToString();
    }
}

public class Assignment
{
    public int AssignmentId { get; set; }
    public string AssignmentName { get; set; } = string.Empty;
    public string AssignmentDescription { get; set; } = string.Empty;

    public int CourseId { get; set; }
    public Course Course { get; set; }
    
    // for navigation
    public ICollection<AssignmentUser> AssignmentUsers { get; set; } = new List<AssignmentUser>();
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime Updated { get; set; } = DateTime.UtcNow;
    public DateTime DueDate { get; set; }
}

public class AssignmentUser
{
    public int AssignmentId { get; set; }
    public Assignment Assignment { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public DateTime AssignedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public decimal? Grade { get; set; }
}