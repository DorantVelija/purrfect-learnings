using Microsoft.EntityFrameworkCore;
using Purrfect_Learnings.Data;
using Purrfect_Learnings.Models;

namespace Purrfect_Learnings.Repositories;

public interface IUserRepository
{
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(int userId, string newName, List<int>? courseIds = null);
    Task<bool> DeleteAsync(int userId);
}

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(int userId, string newName, List<int>? courseIds = null)
    {
        var existingUser = await _context.Users.FindAsync(userId);

        if (existingUser == null) return null;

        existingUser.Name = newName;

        if (courseIds != null)
        {
            // Load existing UserCourses for the user
            var existingUserCourses = await _context.UserCourses
                .Where(uc => uc.UserId == userId)
                .ToListAsync();

            // Remove UserCourses that are not in the new list
            var toRemove = existingUserCourses.Where(uc => !courseIds.Contains(uc.CourseId)).ToList();
            if (toRemove.Any())
            {
                _context.UserCourses.RemoveRange(toRemove);
            }

            // Add new UserCourses that do not already exist
            var existingCourseIds = existingUserCourses.Select(uc => uc.CourseId).ToList();
            var toAdd = courseIds.Except(existingCourseIds);
            foreach (var courseId in toAdd)
            {
                _context.UserCourses.Add(new UserCourse
                {
                    UserId = userId,
                    CourseId = courseId
                });
            }
        }

        await _context.SaveChangesAsync();

        return existingUser;
    }

    public async Task<bool> DeleteAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null) return false;

        var userCourses = await _context.UserCourses
            .Where(uc => uc.UserId == userId)
            .ToListAsync();

        var assignmentUsers = await _context.AssignmentUsers
            .Where(au => au.UserId == userId)
            .ToListAsync();

        if (userCourses.Any())
        {
            _context.UserCourses.RemoveRange(userCourses);
        }

        if (assignmentUsers.Any())
        {
            _context.AssignmentUsers.RemoveRange(assignmentUsers);
        }

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();
        return true;
    }
}