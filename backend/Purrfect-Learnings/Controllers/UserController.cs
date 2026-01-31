using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Purrfect_Learnings.Data;
using Purrfect_Learnings.DTOs;
using Purrfect_Learnings.Models;
using Microsoft.AspNetCore.Authorization;
using Purrfect_Learnings.Repositories;
using System.Security.Claims;

namespace Purrfect_Learnings.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IUserRepository _userRepository;

    public UserController(AppDbContext context, IUserRepository userRepository)
    {
        _context = context;
        _userRepository = userRepository;
    }

    // GET: api/user
    [HttpGet]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }
    
    // GET: api/auth/profile
    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    
        var user = await _context.Users.FindAsync(int.Parse(userId!));
    
        if (user == null)
            return NotFound();

        return Ok(new
        {
            id = user.UserId,
            name = user.Name,
            email = user.Email,
            role = user.Role.ToString()
        });
    }

    // GET: api/user/{id}
    [HttpGet("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // GET: api/user/{id}/courses
    [HttpGet("{id}/courses")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GetUserCourses(int id)
    {
        var exists = await _context.Users.AnyAsync(u => u.UserId == id);
        if (!exists)
            return NotFound("User not found");

        var courses = await _userRepository.GetUserCoursesAsync(id);
        return Ok(courses);
    }

    // GET: api/user/{userId}/courses/{courseId}/assignments
    [HttpGet("{userId}/courses/{courseId}/assignments")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GetUserAssignmentsForCourse(int userId, int courseId)
    {
        var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
        if (!userExists)
            return NotFound("User not found");

        var assignments = await _userRepository.GetUserAssignmentsForCourseAsync(userId, courseId);
        return Ok(assignments);
    }

    // PUT: api/user/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        user.Name = dto.Name;
        user.Email = dto.Email;
        user.Role = dto.Role;

        await _context.SaveChangesAsync();
        return Ok(user);
    }

    // DELETE: api/user/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}