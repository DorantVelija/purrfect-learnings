using Microsoft.AspNetCore.Mvc;
using Purrfect_Learnings.Models;
using Purrfect_Learnings.Repositories;
using System.Threading.Tasks;

namespace Purrfect_Learnings.Controllers;

[ApiController]
[Route("/")]
public class HomeController : ControllerBase
{
    [HttpGet]
    public string Get() => "Purrfect Learnings API is running!";
}

[ApiController]
[Route("/course")]
public class TestController : ControllerBase
{
    [HttpGet]
    public string Get() => "Test blyat!";
}


[ApiController]
[Route("/assignments")]
public class AssignmentController : ControllerBase
{
    private readonly AssignmentRepository _repository;

    public AssignmentController(AssignmentRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var assignments = await _repository.GetAllAsync();
        return Ok(assignments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var assignment = await _repository.GetByIdAsync(id);
        if (assignment == null) return NotFound();
        return Ok(assignment);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Assignment assignment)
    {
        var created = await _repository.CreateAsync(assignment);
        return CreatedAtAction(nameof(GetById), new { id = created.AssignmentId }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Assignment assignment)
    {
        var updated = await _repository.UpdateAsync(id, assignment.AssignmentName, assignment.AssignmentDescription);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _repository.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}