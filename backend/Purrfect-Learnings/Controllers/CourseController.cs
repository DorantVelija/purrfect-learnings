using Microsoft.AspNetCore.Mvc;
using Purrfect_Learnings.Repositories;
using Purrfect_Learnings.DTOs;
using System.Threading.Tasks;

namespace Purrfect_Learnings.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseRepository _courseRepository;

        public CourseController(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var courses = await _courseRepository.GetAllAsync();
            return Ok(courses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var course = await _courseRepository.GetByIdAsync(id);
            if (course == null)
                return NotFound();

            return Ok(course);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _courseRepository.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                created
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCourseDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _courseRepository.UpdateAsync(id, dto);
            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _courseRepository.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}