using System;
using System.Collections.Generic;

namespace Purrfect_Learnings.DTOs
{
    public class AssignmentUserDto
    {
        public int UserId { get; set; }
        public DateTime AssignedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public decimal? Grade { get; set; }
        public int AssignmentId { get; set; } // <-- make sure this exists
    }

    public class AssignmentDto
    {
        public int AssignmentId { get; set; } // <-- must match
        public string AssignmentName { get; set; }
        public string AssignmentDescription { get; set; }
        public int CourseId { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public DateTime DueDate { get; set; }
        public List<AssignmentUserDto> Users { get; set; } = new List<AssignmentUserDto>();
    }
}