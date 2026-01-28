using Microsoft.AspNetCore.Mvc;
using Purrfect_Learnings.Repositories;
using Purrfect_Learnings.DTOs;
using Purrfect_Learnings.Models;
using System.Threading.Tasks;

namespace Purrfect_Learnings.Controllers;

[ApiController]
[Route("api/assignments")]
public class AssignmentController : ControllerBase
{
    private readonly AssignmentRepository _repository;

    public AssignmentController(AssignmentRepository repository)
    {
        _repository = repository;
    }

    // GET: api/assignments
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var assignments = await _repository.GetAllAsync();
        return Ok(assignments);
    }

    // GET: api/assignments/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var assignment = await _repository.GetByIdAsync(id);
        if (assignment == null)
            return NotFound();

        return Ok(assignment);
    }

    // POST: api/assignments
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAssignmentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var assignment = new Assignment
        {
            AssignmentName = dto.AssignmentName,
            AssignmentDescription = dto.AssignmentDescription,
            CourseId = dto.CourseId,
            DueDate = dto.DueDate
        };

        var created = await _repository.CreateAsync(assignment);

        return CreatedAtAction(
            nameof(GetById),
            new { id = created.AssignmentId },
            created
        );
    }

    // PUT: api/assignments/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateAssignmentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _repository.UpdateAsync(
            id,
            dto.AssignmentName,
            dto.AssignmentDescription
        );

        if (updated == null)
            return NotFound();

        return Ok(updated);
    }

    // PUT: api/assignments/{assignmentId}/grade
    [HttpPut("{assignmentId}/grade")]
    public async Task<IActionResult> GradeAssignment(
        int assignmentId,
        [FromBody] GradeAssignmentDto dto)
    {
        var success = await _repository.GradeAsync(
            assignmentId,
            dto.UserId,
            dto.Grade
        );

        if (!success)
            return NotFound();

        return Ok();
    }

    // DELETE: api/assignments/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _repository.DeleteAsync(id);
        if (!success)
            return NotFound();

        return NoContent();
    }
}