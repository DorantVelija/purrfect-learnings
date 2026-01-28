using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

    // GET: api/user
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    // GET: api/user/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // POST: api/user
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Role = dto.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = user.UserId },
            user
        );
    }

    // PUT: api/user/{id}
    [HttpPut("{id}")]
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