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
        {
            return false;
        }

        var assignments = _context.Assignments.Where(a => a.CourseId == id);
        _context.Assignments.RemoveRange(assignments);

        if (course.Users != null)
        {
            _context.UserCourses.RemoveRange(course.Users);
        }

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
        {
            throw new Exception("Course not found");
        }

        course.Name = dto.Name;
        course.Description = dto.Description;
        course.Updated = DateTime.UtcNow;

        // Remove UserCourses for students in RemoveStudentIds
        if (dto.RemoveStudentIds != null)
        {
            var toRemoveStudents = course.Users
                .Where(uc => dto.RemoveStudentIds.Contains(uc.UserId) && uc.Role == Role.Student)
                .ToList();
            foreach (var uc in toRemoveStudents)
            {
                course.Users.Remove(uc);
                _context.UserCourses.Remove(uc);
            }
        }

        // Remove UserCourses for teachers in RemoveTeacherIds
        if (dto.RemoveTeacherIds != null)
        {
            var toRemoveTeachers = course.Users
                .Where(uc => dto.RemoveTeacherIds.Contains(uc.UserId) && uc.Role == Role.Teacher)
                .ToList();
            foreach (var uc in toRemoveTeachers)
            {
                course.Users.Remove(uc);
                _context.UserCourses.Remove(uc);
            }
        }

        // Add UserCourses for students in AddStudentIds
        if (dto.AddStudentIds != null)
        {
            foreach (var userId in dto.AddStudentIds)
            {
                if (!course.Users.Any(uc => uc.UserId == userId && uc.Role == Role.Student))
                {
                    var newUserCourse = new UserCourse
                    {
                        UserId = userId,
                        Role = Role.Student,
                        CourseId = id
                    };
                    course.Users.Add(newUserCourse);
                }
            }
        }

        // Add UserCourses for teachers in AddTeacherIds
        if (dto.AddTeacherIds != null)
        {
            foreach (var userId in dto.AddTeacherIds)
            {
                if (!course.Users.Any(uc => uc.UserId == userId && uc.Role == Role.Teacher))
                {
                    var newUserCourse = new UserCourse
                    {
                        UserId = userId,
                        Role = Role.Teacher,
                        CourseId = id
                    };
                    course.Users.Add(newUserCourse);
                }
            }
        }

        await _context.SaveChangesAsync();
        return course;
    }
}