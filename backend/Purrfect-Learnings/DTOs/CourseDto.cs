using System.Collections.Generic;

namespace Purrfect_Learnings.DTOs
{
    public class CreateCourseDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<int> TeacherIds { get; set; } = new List<int>();
    }

    public class UpdateCourseDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<int> AddStudentIds { get; set; } = new List<int>();
        public List<int> RemoveStudentIds { get; set; } = new List<int>();
        public List<int> AddTeacherIds { get; set; } = new List<int>();
        public List<int> RemoveTeacherIds { get; set; } = new List<int>();
    }
}