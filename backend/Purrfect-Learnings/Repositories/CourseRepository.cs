using Microsoft.EntityFrameworkCore;
using Purrfect_Learnings.Data;
using Purrfect_Learnings.DTOs;
using Purrfect_Learnings.Models;

namespace Purrfect_Learnings.Repositories
{
    public interface ICourseRepository
    {
        Task<IEnumerable<Course>> GetAllForUserAsync(int userId);
        Task<CourseReadDto?> GetByIdAsync(int courseId, int userId);
        Task<IEnumerable<UserCourse>> GetUsersForCourseAsync(int courseId, int userId);
        Task<Course> CreateAsync(CreateCourseDto dto, int teacherId);
        Task<Course?> UpdateAsync(int id, UpdateCourseDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> JoinCourseAsync(string joinCode, int userId);
        Task<bool> LeaveCourseAsync(int courseId, int userId);
    }

    // --- The Implementation ---
    public class CourseRepository : ICourseRepository
    {
        private readonly AppDbContext _context;

        public CourseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Course>> GetAllForUserAsync(int userId)
        {
            return await _context.UserCourses
                .Where(uc => uc.UserId == userId)
                .Select(uc => uc.Course)
                .ToListAsync();
        }

        public async Task<CourseReadDto?> GetByIdAsync(int courseId, int userId)
        {
            var course = await _context.Courses
                .Include(c => c.Users)
                    .ThenInclude(uc => uc.User)
                .FirstOrDefaultAsync(c => c.Id == courseId);

            if (course == null) return null;

            // Security Check: User must be enrolled to see details
            var isEnrolled = course.Users.Any(uc => uc.UserId == userId);
            if (!isEnrolled) return null;

            return new CourseReadDto
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                JoinCode = course.JoinCode,
                Teachers = course.Users
                    .Where(uc => uc.Role == Role.Teacher)
                    .Select(uc => new CourseUserDto { Id = uc.UserId, Name = uc.User.Name })
                    .ToList(),
                Students = course.Users
                    .Where(uc => uc.Role == Role.Student)
                    .Select(uc => new CourseUserDto { Id = uc.UserId, Name = uc.User.Name })
                    .ToList()
            };
        }

        public async Task<IEnumerable<UserCourse>> GetUsersForCourseAsync(int courseId, int userId)
        {
            // Security Check: Only course members can see the user list
            var isMember = await _context.UserCourses
                .AnyAsync(uc => uc.CourseId == courseId && uc.UserId == userId);

            if (!isMember) return Enumerable.Empty<UserCourse>();

            return await _context.UserCourses
                .Include(uc => uc.User)
                .Where(uc => uc.CourseId == courseId)
                .ToListAsync();
        }

        public async Task<Course> CreateAsync(CreateCourseDto dto, int teacherId)
        {
            var course = new Course
            {
                Name = dto.Name,
                Description = dto.Description,
                JoinCode = Guid.NewGuid().ToString().Substring(0, 8).ToUpper()
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            // Automatically add the creator as the Teacher
            _context.UserCourses.Add(new UserCourse
            {
                UserId = teacherId,
                CourseId = course.Id,
                Role = Role.Teacher
            });

            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<Course?> UpdateAsync(int id, UpdateCourseDto dto)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return null;

            course.Name = dto.Name;
            course.Description = dto.Description;

            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> JoinCourseAsync(string joinCode, int userId)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.JoinCode == joinCode);

            if (course == null) return false;

            var exists = await _context.UserCourses
                .AnyAsync(uc => uc.CourseId == course.Id && uc.UserId == userId);
            if (exists) return false;

            _context.UserCourses.Add(new UserCourse
            {
                UserId = userId,
                CourseId = course.Id,
                Role = Role.Student
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> LeaveCourseAsync(int courseId, int userId)
        {
            var userCourse = await _context.UserCourses
                .FirstOrDefaultAsync(uc => uc.CourseId == courseId && uc.UserId == userId);

            if (userCourse == null) return false;

            _context.UserCourses.Remove(userCourse);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}