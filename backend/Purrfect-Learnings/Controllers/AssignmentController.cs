using Microsoft.AspNetCore.Mvc;
using Purrfect_Learnings.Repositories;
using System.Security.Claims;
using Purrfect_Learnings.DTOs;
using Purrfect_Learnings.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Purrfect_Learnings.Controllers;

[ApiController]
[Route("api/assignments")]
[Authorize]
public class AssignmentController : ControllerBase
{
    private readonly AssignmentRepository _repository;

    public AssignmentController(AssignmentRepository repository)
    {
        _repository = repository;
    }
    
    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string GetUserRole() => User.FindFirstValue(ClaimTypes.Role)!;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var currentUserId = GetUserId();
        var userRole = GetUserRole();

        // Pass security context to the repository
        var result = await _repository.GetByIdAsync(id, currentUserId, userRole);
        
        if (result == null) 
            return NotFound("Assignment not found or access denied.");
            
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAssignmentDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var updated = await _repository.UpdateAsync(
            id,
            dto.AssignmentName,
            dto.AssignmentDescription,
            dto.AddUserIds ?? new List<int>(),
            dto.RemoveUserIds ?? new List<int>()
        );

        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpGet("course/{courseId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByCourseId(int courseId) => Ok(await _repository.GetByCourseIdAsync(courseId));

    [HttpGet("user/me")]
    public async Task<IActionResult> GetMyAssignments() => Ok(await _repository.GetByUserIdAsync(GetUserId()));

    [HttpPost]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Create([FromBody] CreateAssignmentDto dto)
    {
        var a = new Assignment { 
            AssignmentName = dto.AssignmentName, 
            AssignmentDescription = dto.AssignmentDescription, 
            CourseId = dto.CourseId, 
            DueDate = dto.DueDate,
            Created = DateTime.UtcNow,
            Updated = DateTime.UtcNow
        };
        return Ok(await _repository.CreateAsync(a));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Delete(int id) => await _repository.DeleteAsync(id) ? NoContent() : NotFound();

    [HttpPut("{assignmentId}/grade")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GradeAssignment(int assignmentId, [FromBody] GradeAssignmentDto dto)
    {
        var success = await _repository.GradeAsync(assignmentId, dto.UserId, dto.Grade);
        return success ? Ok() : NotFound();
    }
}