using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Purrfect_Learnings.Data;
using Purrfect_Learnings.DTOs;
using Purrfect_Learnings.Models;

namespace Purrfect_Learnings.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }
    
    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
        if (exists)
            return BadRequest("User already exists");

        if (!Enum.TryParse<Role>(dto.Role, true, out var role))
            return BadRequest("Invalid role");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Role = role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            user.UserId,
            user.Name,
            user.Email,
            Role = user.Role.ToString()
        });
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            return Unauthorized("Invalid credentials");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_config["Jwt:ExpireMinutes"])
            ),
            signingCredentials: new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256
            )
        );

        var refreshToken = new RefreshToken
        {
            UserId = user.UserId,
            Token = Guid.NewGuid().ToString(),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            accessToken = new JwtSecurityTokenHandler().WriteToken(token),
            refreshToken = refreshToken.Token
        });
    }

    // POST: api/auth/refresh
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        var storedToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt =>
                rt.Token == refreshToken &&
                !rt.IsRevoked &&
                rt.ExpiresAt > DateTime.UtcNow);

        if (storedToken == null)
            return Unauthorized();

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, storedToken.User.UserId.ToString()),
            new Claim(ClaimTypes.Role, storedToken.User.Role.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );

        var newToken = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_config["Jwt:ExpireMinutes"])
            ),
            signingCredentials: new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256
            )
        );

        return Ok(new
        {
            accessToken = new JwtSecurityTokenHandler().WriteToken(newToken)
        });
    }

    // POST: api/auth/logout
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] string refreshToken)
    {
        var token = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (token != null)
        {
            token.IsRevoked = true;
            await _context.SaveChangesAsync();
        }

        return Ok();
    }
}