using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Purrfect_Learnings.Repositories;
using Purrfect_Learnings.DTOs;
using Purrfect_Learnings.Models;

namespace Purrfect_Learnings.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CourseController : ControllerBase
    {
        private readonly ICourseRepository _courseRepository;

        public CourseController(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            var courses = await _courseRepository.GetAllForUserAsync(userId);

            var result = courses.Select(c => new CourseReadDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                JoinCode = c.JoinCode
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetUserId();
            var courseDto = await _courseRepository.GetByIdAsync(id, userId);

            if (courseDto == null)
                return NotFound("Course not found or access denied.");

            return Ok(courseDto);
        }

        [HttpGet("{id}/users")]
        public async Task<IActionResult> GetUsersForCourse(int id)
        {
            var userId = GetUserId();
            var users = await _courseRepository.GetUsersForCourseAsync(id, userId);

            if (!users.Any() && id != 0)
                return NotFound("Access denied or no users found.");

            var result = users.Select(uc => new
            {
                Id = uc.UserId,
                Name = uc.User.Name,
                Role = uc.Role.ToString()
            });

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
        {
            var userId = GetUserId();
            var created = await _courseRepository.CreateAsync(dto, userId);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, new CourseReadDto
            {
                Id = created.Id,
                Name = created.Name,
                Description = created.Description
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCourseDto dto)
        {
            var updated = await _courseRepository.UpdateAsync(id, dto);
            if (updated == null) return NotFound();

            return Ok(new CourseReadDto {
                Id = updated.Id,
                Name = updated.Name,
                Description = updated.Description
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> Delete(int id)
        {
            return await _courseRepository.DeleteAsync(id) ? NoContent() : NotFound();
        }

        [HttpPost("{id}/join")]
        public async Task<IActionResult> Join([FromQuery] string joinCode)
        {
            var userId = GetUserId();
            var success = await _courseRepository.JoinCourseAsync(joinCode, userId);
            return success ? Ok() : BadRequest("Invalid join code or already enrolled.");
        }

        [HttpDelete("{id}/leave")]
        public async Task<IActionResult> Leave(int id)
        {
            var userId = GetUserId();
            var success = await _courseRepository.LeaveCourseAsync(id, userId);
            return success ? Ok() : BadRequest("Not enrolled in this course.");
        }
    }
}