using Purrfect_Learnings.Models;
using Purrfect_Learnings.Data;
using Purrfect_Learnings.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Purrfect_Learnings.Repositories;

public interface ICourseRepository
{
    Task<Course> CreateAsync(CreateCourseDto dto, int creatorUserId);
    Task<bool> DeleteAsync(int id);
    Task<Course> UpdateAsync(int id, UpdateCourseDto dto);

    Task<IEnumerable<Course>> GetAllAsync();                 // all courses (admin/debug)
    Task<IEnumerable<Course>> GetAllForUserAsync(int userId); // courses for logged-in user
    Task<Course?> GetByIdAsync(int id);

    Task<bool> JoinCourseAsync(string joinCode, int userId);
    Task<bool> LeaveCourseAsync(int courseId, int userId);

    Task<IEnumerable<UserCourse>> GetUsersForCourseAsync(int courseId);
}

public class CourseRepository : ICourseRepository
{
    private readonly AppDbContext _context;

    public CourseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Course> CreateAsync(CreateCourseDto dto, int creatorUserId)
    {
        var course = new Course
        {
            Name = dto.Name,
            Description = dto.Description,
            Created = DateTime.UtcNow,
            Updated = DateTime.UtcNow
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        _context.UserCourses.Add(new UserCourse
        {
            CourseId = course.Id,
            UserId = creatorUserId,
            Role = Role.Teacher
        });

        await _context.SaveChangesAsync();
        return course;
    }

    public async Task<IEnumerable<Course>> GetAllAsync()
    {
        return await _context.Courses
            .Include(c => c.Users)
            .ThenInclude(uc => uc.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<Course>> GetAllForUserAsync(int userId)
    {
        return await _context.Courses
            .Where(c => c.Users.Any(uc => uc.UserId == userId))
            .Include(c => c.Users)
            .ThenInclude(uc => uc.User)
            .ToListAsync();
    }

    public async Task<Course?> GetByIdAsync(int id)
    {
        return await _context.Courses
            .Include(c => c.Users)
            .ThenInclude(uc => uc.User)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<UserCourse>> GetUsersForCourseAsync(int courseId)
    {
        return await _context.UserCourses
            .Where(uc => uc.CourseId == courseId)
            .Include(uc => uc.User)
            .ToListAsync();
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

            _context.UserCourses.RemoveRange(toRemove);
        }

        if (dto.RemoveTeacherIds != null)
        {
            var toRemove = course.Users
                .Where(uc => dto.RemoveTeacherIds.Contains(uc.UserId) && uc.Role == Role.Teacher)
                .ToList();

            _context.UserCourses.RemoveRange(toRemove);
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
    public async Task<bool> JoinCourseAsync(string joinCode, int userId)
    {
        var course = await _context.Courses
            .FirstOrDefaultAsync(c => c.JoinCode == joinCode);

        if (course == null)
            return false;
        
        var alreadyJoined = await _context.UserCourses
            .AnyAsync(uc => uc.CourseId == course.Id && uc.UserId == userId);

        if (alreadyJoined)
            return false;
        
        _context.UserCourses.Add(new UserCourse
        {
            CourseId = course.Id,
            UserId = userId,
            Role = Role.Student
        });

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> LeaveCourseAsync(int courseId, int userId)
    {
        var userCourse = await _context.UserCourses
            .FirstOrDefaultAsync(uc => uc.CourseId == courseId && uc.UserId == userId);

        if (userCourse == null)
            return false;

        _context.UserCourses.Remove(userCourse);
        await _context.SaveChangesAsync();
        return true;
    }
}