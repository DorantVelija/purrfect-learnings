using Purrfect_Learnings.Models;

namespace Purrfect_Learnings.DTOs
{
    public class CreateUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public Role Role { get; set; } = Role.Teacher;
    }
}