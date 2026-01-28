namespace Purrfect_Learnings.DTOs
{
    public class RegisterDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "Student"; // default
    }
}