using Microsoft.AspNetCore.Mvc;
using Purrfect_Learnings.Data;
using Purrfect_Learnings.DTOs;
using Purrfect_Learnings.Models;

namespace Purrfect_Learnings.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult CreateUser([FromBody] CreateUserDto createUserDto)
    {
        if (createUserDto == null)
        {
            return BadRequest();
        }

        var user = new User
        {
            // Assuming CreateUserDto has properties like Username, Email, etc.
            Name = createUserDto.Name,
            Email = createUserDto.Email,
            // Map other properties as needed
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return CreatedAtAction(nameof(CreateUser), new { id = user.UserId }, user);
    }
}