using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
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

        // ============================
        // helper: logged-in user id
        // ============================
        private int GetUserId()
        {
            return int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );
        }

        // ============================
        // GET courses for logged-in user
        // ============================
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

        // ============================
        // GET course by id
        // ============================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var course = await _courseRepository.GetByIdAsync(id);
            if (course == null)
                return NotFound();

            return Ok(new CourseReadDto
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                JoinCode = course.JoinCode,

                Teachers = course.Users
                    .Where(uc => uc.Role == Role.Teacher)
                    .Select(uc => new CourseUserDto
                    {
                        Id = uc.UserId,
                        Name = uc.User.Name
                    })
                    .ToList(),

                Students = course.Users
                    .Where(uc => uc.Role == Role.Student)
                    .Select(uc => new CourseUserDto
                    {
                        Id = uc.UserId,
                        Name = uc.User.Name
                    })
                    .ToList()
            });
        }

        // ============================
        // CREATE course (teachers)
        // ============================
        [HttpPost]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
        {
            var userId = GetUserId();
            var created = await _courseRepository.CreateAsync(dto, userId);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                new CourseReadDto
                {
                    Id = created.Id,
                    Name = created.Name,
                    Description = created.Description
                }
            );
        }

        // ============================
        // UPDATE course (teachers)
        // ============================
        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCourseDto dto)
        {
            var updated = await _courseRepository.UpdateAsync(id, dto);
            if (updated == null)
                return NotFound();

            return Ok(new CourseReadDto
            {
                Id = updated.Id,
                Name = updated.Name,
                Description = updated.Description
            });
        }

        // ============================
        // DELETE course (teachers)
        // ============================
        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _courseRepository.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }

        // ============================
        // JOIN a course
        // POST /api/course/{id}/join
        // ============================
        [HttpPost("{id}/join")]
        public async Task<IActionResult> Join([FromBody] string joinCode)
        {
            var userId = GetUserId();

            var success = await _courseRepository.JoinCourseAsync(joinCode, userId);
            if (!success)
                return BadRequest("Cannot join course");

            return Ok();
        }

        // ============================
        // LEAVE a course
        // DELETE /api/course/{id}/leave
        // ============================
        [HttpDelete("{id}/leave")]
        public async Task<IActionResult> Leave(int id)
        {
            var userId = GetUserId();

            var success = await _courseRepository.LeaveCourseAsync(id, userId);
            if (!success)
                return BadRequest("Not enrolled in this course");

            return Ok();
        }
    }
}