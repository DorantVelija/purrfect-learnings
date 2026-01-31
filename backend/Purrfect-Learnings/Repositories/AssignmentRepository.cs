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

        // CREATE
        public async Task<Assignment> CreateAsync(Assignment assignment)
        {
            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();
            return assignment;
        }

        // UPDATE (name + description)
        public async Task<Assignment?> UpdateAsync(
            int assignmentId,
            string newTitle,
            string? newDescription = null)
        {
            var assignment = await _context.Assignments
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)
                return null;

            assignment.AssignmentName = newTitle;

            if (newDescription != null)
                assignment.AssignmentDescription = newDescription;

            assignment.Updated = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return assignment;
        }

        // DELETE
        public async Task<bool> DeleteAsync(int assignmentId)
        {
            var assignment = await _context.Assignments
                .Include(a => a.AssignmentUsers)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)
                return false;

            _context.AssignmentUsers.RemoveRange(assignment.AssignmentUsers);
            _context.Assignments.Remove(assignment);

            await _context.SaveChangesAsync();
            return true;
        }

        // GET ALL
        public async Task<List<AssignmentDto>> GetAllAsync()
        {
            var assignments = await _context.Assignments
                .Include(a => a.AssignmentUsers)
                .ToListAsync();

            return assignments.Select(a => new AssignmentDto
            {
                AssignmentId = a.AssignmentId,
                AssignmentName = a.AssignmentName,
                AssignmentDescription = a.AssignmentDescription,
                CourseId = a.CourseId,
                Created = a.Created,
                Updated = a.Updated,
                DueDate = a.DueDate,
                Users = a.AssignmentUsers.Select(au => new AssignmentUserDto
                {
                    AssignmentId = au.AssignmentId,
                    UserId = au.UserId,
                    AssignedAt = au.AssignedAt,
                    SubmittedAt = au.SubmittedAt,
                    Grade = au.Grade
                }).ToList()
            }).ToList();
        }

        // GET BY ID
        public async Task<AssignmentDto?> GetByIdAsync(int assignmentId)
        {
            var assignment = await _context.Assignments
                .Include(a => a.AssignmentUsers)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)
                return null;

            return new AssignmentDto
            {
                AssignmentId = assignment.AssignmentId,
                AssignmentName = assignment.AssignmentName,
                AssignmentDescription = assignment.AssignmentDescription,
                CourseId = assignment.CourseId,
                Created = assignment.Created,
                Updated = assignment.Updated,
                DueDate = assignment.DueDate,
                Users = assignment.AssignmentUsers.Select(au => new AssignmentUserDto
                {
                    AssignmentId = au.AssignmentId,
                    UserId = au.UserId,
                    AssignedAt = au.AssignedAt,
                    SubmittedAt = au.SubmittedAt,
                    Grade = au.Grade
                }).ToList()
            };
        }

        // GRADE ASSIGNMENT
        public async Task<bool> GradeAsync(
            int assignmentId,
            int userId,
            decimal grade)
        {
            var assignmentUser = await _context.AssignmentUsers
                .FirstOrDefaultAsync(au =>
                    au.AssignmentId == assignmentId &&
                    au.UserId == userId);

            if (assignmentUser == null)
                return false;

            assignmentUser.Grade = grade;
            assignmentUser.SubmittedAt ??= DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        // GET BY COURSE ID
        public async Task<List<AssignmentDto>> GetByCourseIdAsync(int courseId)
        {
            var assignments = await _context.Assignments
                .Where(a => a.CourseId == courseId)
                .Include(a => a.AssignmentUsers)
                .ToListAsync();

            return assignments.Select(a => new AssignmentDto
            {
                AssignmentId = a.AssignmentId,
                AssignmentName = a.AssignmentName,
                AssignmentDescription = a.AssignmentDescription,
                CourseId = a.CourseId,
                Created = a.Created,
                Updated = a.Updated,
                DueDate = a.DueDate,
                Users = a.AssignmentUsers.Select(au => new AssignmentUserDto
                {
                    AssignmentId = au.AssignmentId,
                    UserId = au.UserId,
                    AssignedAt = au.AssignedAt,
                    SubmittedAt = au.SubmittedAt,
                    Grade = au.Grade
                }).ToList()
            }).ToList();
        }

        // GET BY USER ID
        public async Task<List<AssignmentDto>> GetByUserIdAsync(int userId)
        {
            var assignments = await _context.AssignmentUsers
                .Where(au => au.UserId == userId)
                .Include(au => au.Assignment)
                .ThenInclude(a => a.AssignmentUsers)
                .Select(au => au.Assignment)
                .Distinct()
                .ToListAsync();

            return assignments.Select(a => new AssignmentDto
            {
                AssignmentId = a.AssignmentId,
                AssignmentName = a.AssignmentName,
                AssignmentDescription = a.AssignmentDescription,
                CourseId = a.CourseId,
                Created = a.Created,
                Updated = a.Updated,
                DueDate = a.DueDate,
                Users = a.AssignmentUsers.Select(au => new AssignmentUserDto
                {
                    AssignmentId = au.AssignmentId,
                    UserId = au.UserId,
                    AssignedAt = au.AssignedAt,
                    SubmittedAt = au.SubmittedAt,
                    Grade = au.Grade
                }).ToList()
            }).ToList();
        }
    }
}