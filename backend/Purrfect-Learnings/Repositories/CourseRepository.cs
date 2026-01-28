using Purrfect_Learnings.Models;
using Purrfect_Learnings.Data;
using Purrfect_Learnings.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Purrfect_Learnings.Repositories;

public interface ICourseRepository
{
    Task<Course> CreateAsync(CreateCourseDto dto);
    Task<bool> DeleteAsync(int id);
    Task<Course> UpdateAsync(int id, UpdateCourseDto dto);
    Task<IEnumerable<Course>> GetAllAsync();
    Task<Course?> GetByIdAsync(int id);
}

public class CourseRepository : ICourseRepository
{
    private readonly AppDbContext _context;

    public CourseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Course> CreateAsync(CreateCourseDto dto)
    {
        var course = new Course
        {
            Name = dto.Name,
            Description = dto.Description,
            Created = DateTime.UtcNow,
            Updated = DateTime.UtcNow
        };

        if (dto.TeacherIds != null)
        {
            foreach (var userId in dto.TeacherIds)
            {
                course.Users.Add(new UserCourse
                {
                    UserId = userId,
                    Role = Role.Teacher,
                    Course = course
                });
            }
        }

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        return course;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var course = await _context.Courses
            .Include(c => c.Users)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
            return false;

        var assignments = _context.Assignments.Where(a => a.CourseId == id);
        _context.Assignments.RemoveRange(assignments);

        _context.UserCourses.RemoveRange(course.Users);
        _context.Courses.Remove(course);

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Course> UpdateAsync(int id, UpdateCourseDto dto)
    {
        var course = await _context.Courses
            .Include(c => c.Users)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
            throw new Exception("Course not found");

        course.Name = dto.Name;
        course.Description = dto.Description;
        course.Updated = DateTime.UtcNow;

        if (dto.RemoveStudentIds != null)
        {
            var toRemove = course.Users
                .Where(uc => dto.RemoveStudentIds.Contains(uc.UserId) && uc.Role == Role.Student)
                .ToList();

            foreach (var uc in toRemove)
            {
                course.Users.Remove(uc);
                _context.UserCourses.Remove(uc);
            }
        }

        if (dto.RemoveTeacherIds != null)
        {
            var toRemove = course.Users
                .Where(uc => dto.RemoveTeacherIds.Contains(uc.UserId) && uc.Role == Role.Teacher)
                .ToList();

            foreach (var uc in toRemove)
            {
                course.Users.Remove(uc);
                _context.UserCourses.Remove(uc);
            }
        }

        if (dto.AddStudentIds != null)
        {
            foreach (var userId in dto.AddStudentIds)
            {
                if (!course.Users.Any(uc => uc.UserId == userId && uc.Role == Role.Student))
                {
                    course.Users.Add(new UserCourse
                    {
                        UserId = userId,
                        Role = Role.Student,
                        CourseId = id
                    });
                }
            }
        }

        if (dto.AddTeacherIds != null)
        {
            foreach (var userId in dto.AddTeacherIds)
            {
                if (!course.Users.Any(uc => uc.UserId == userId && uc.Role == Role.Teacher))
                {
                    course.Users.Add(new UserCourse
                    {
                        UserId = userId,
                        Role = Role.Teacher,
                        CourseId = id
                    });
                }
            }
        }

        await _context.SaveChangesAsync();
        return course;
    }

    public async Task<IEnumerable<Course>> GetAllAsync()
    {
        return await _context.Courses
            .Include(c => c.Users)
            .ToListAsync();
    }

    public async Task<Course?> GetByIdAsync(int id)
    {
        return await _context.Courses
            .Include(c => c.Users)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
}