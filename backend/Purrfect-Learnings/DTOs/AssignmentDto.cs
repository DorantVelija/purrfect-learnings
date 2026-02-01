using System;
using System.Collections.Generic;

namespace Purrfect_Learnings.DTOs
{
    // For returning which users have the assignment + status
    public class AssignmentUserDto
    {
        public int AssignmentId { get; set; }
        public int UserId { get; set; }

        public DateTime AssignedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public decimal? Grade { get; set; }
    }

    // For returning an assignment (with users list)
    public class AssignmentDto
    {
        public int AssignmentId { get; set; }

        public string AssignmentName { get; set; } = string.Empty;
        public string AssignmentDescription { get; set; } = string.Empty;

        public int CourseId { get; set; }

        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public DateTime DueDate { get; set; }

        public List<AssignmentUserDto> Users { get; set; } = new();
    }

    // For creating an assignment (POST)
    public class CreateAssignmentDto
    {
        public string AssignmentName { get; set; } = string.Empty;
        public string AssignmentDescription { get; set; } = string.Empty;

        public int CourseId { get; set; }
        public DateTime DueDate { get; set; }
    }

    // For updating an assignment (PUT)
    public class UpdateAssignmentDto
    {
        public string? AssignmentName { get; set; } = string.Empty;
        public string? AssignmentDescription { get; set; } = string.Empty;

        // Users to be assigned to this assignment
        public List<int> AddUserIds { get; set; } = new();

        // Users to be unassigned from this assignment
        public List<int> RemoveUserIds { get; set; } = new();
    }

    // For grading a student's assignment (PUT /grade)
    public class GradeAssignmentDto
    {
        public int UserId { get; set; }
        public decimal Grade { get; set; }
    }
}