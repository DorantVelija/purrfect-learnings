using System.Collections.Generic;

namespace Purrfect_Learnings.DTOs
{
    public class CourseUserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class CourseReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string JoinCode { get; set; } = string.Empty;

        public List<CourseUserDto> Teachers { get; set; } = new();
        public List<CourseUserDto> Students { get; set; } = new();
    }

    public class CreateCourseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class UpdateCourseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<int> AddStudentIds { get; set; } = new();
        public List<int> RemoveStudentIds { get; set; } = new();
        public List<int> AddTeacherIds { get; set; } = new();
        public List<int> RemoveTeacherIds { get; set; } = new();
    }
}