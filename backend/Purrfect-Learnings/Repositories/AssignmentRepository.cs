using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Purrfect_Learnings.Data;
using Purrfect_Learnings.Models;
using Purrfect_Learnings.DTOs;

namespace Purrfect_Learnings.Repositories
{
    public class AssignmentRepository
    {
        private readonly AppDbContext _context;

        public AssignmentRepository(AppDbContext context)
        {
            _context = context;
        }

        private AssignmentDto MapToDto(Assignment a)
        {
            return new AssignmentDto
            {
                AssignmentId = a.AssignmentId,
                AssignmentName = a.AssignmentName,
                AssignmentDescription = a.AssignmentDescription ?? string.Empty,
                CourseId = a.CourseId,
                Created = a.Created,
                Updated = a.Updated,
                DueDate = a.DueDate,
                Users = a.AssignmentUsers?.Select(au => new AssignmentUserDto
                {
                    AssignmentId = au.AssignmentId,
                    UserId = au.UserId,
                    AssignedAt = au.AssignedAt,
                    SubmittedAt = au.SubmittedAt,
                    Grade = au.Grade
                }).ToList() ?? new List<AssignmentUserDto>()
            };
        }

        public async Task<AssignmentDto> CreateAsync(Assignment assignment)
        {
            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();
            return MapToDto(assignment);
        }

        public async Task<AssignmentDto?> UpdateAsync(
            int assignmentId,
            string? newTitle,
            string? newDescription,
            List<int> addUserIds,
            List<int> removeUserIds)
        {
            var assignment = await _context.Assignments
                .Include(a => a.AssignmentUsers)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null) return null;

            if (!string.IsNullOrWhiteSpace(newTitle))
                assignment.AssignmentName = newTitle;

            assignment.AssignmentDescription = newDescription ?? string.Empty;
            assignment.Updated = DateTime.UtcNow;

            foreach (var userId in addUserIds.Distinct())
            {
                if (!assignment.AssignmentUsers.Any(au => au.UserId == userId))
                {
                    assignment.AssignmentUsers.Add(new AssignmentUser
                    {
                        AssignmentId = assignmentId,
                        UserId = userId,
                        AssignedAt = DateTime.UtcNow
                    });
                }
            }

            var usersToRemove = assignment.AssignmentUsers
                .Where(au => removeUserIds.Contains(au.UserId))
                .ToList();

            foreach (var user in usersToRemove)
            {
                _context.AssignmentUsers.Remove(user);
            }

            await _context.SaveChangesAsync();
            return MapToDto(assignment);
        }

        // NEW: Security-aware GetById
        public async Task<AssignmentDto?> GetByIdAsync(int assignmentId, int currentUserId, string userRole)
        {
            var assignment = await _context.Assignments
                .Include(a => a.Course) // Needed to check Course.TeacherId
                .Include(a => a.AssignmentUsers)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null) return null;

            // Logic: Is Teacher of the course OR is a student assigned to it
            bool isTeacher = userRole == "Teacher";
            bool isAssigned = assignment.AssignmentUsers.Any(au => au.UserId == currentUserId);

            if (!isTeacher && !isAssigned) return null;

            return MapToDto(assignment);
        }

        public async Task<List<AssignmentDto>> GetAllAsync() => 
            (await _context.Assignments.Include(a => a.AssignmentUsers).ToListAsync()).Select(MapToDto).ToList();

        public async Task<List<AssignmentDto>> GetByCourseIdAsync(int courseId) => 
            (await _context.Assignments.Where(a => a.CourseId == courseId).Include(a => a.AssignmentUsers).ToListAsync()).Select(MapToDto).ToList();

        public async Task<List<AssignmentDto>> GetByUserIdAsync(int userId)
        {
            var assignments = await _context.AssignmentUsers
                .Where(au => au.UserId == userId)
                .Include(au => au.Assignment)
                .ThenInclude(a => a.AssignmentUsers)
                .Select(au => au.Assignment)
                .Distinct()
                .ToListAsync();
            return assignments.Select(MapToDto).ToList();
        }

        public async Task<bool> GradeAsync(int assignmentId, int userId, decimal grade)
        {
            var entry = await _context.AssignmentUsers.FirstOrDefaultAsync(au => au.AssignmentId == assignmentId && au.UserId == userId);
            if (entry == null) return false;
            entry.Grade = grade;
            entry.SubmittedAt ??= DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var a = await _context.Assignments.FindAsync(id);
            if (a == null) return false;
            _context.Assignments.Remove(a);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}