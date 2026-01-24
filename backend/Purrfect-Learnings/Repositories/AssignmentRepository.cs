using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Purrfect_Learnings.Models;
using Purrfect_Learnings.Data;
using Purrfect_Learnings.DTOs;
using System.Linq;

namespace Purrfect_Learnings.Repositories
{
    public class AssignmentRepository
    {
        private readonly AppDbContext _context;

        public AssignmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Assignment> CreateAsync(Assignment assignment)
        {
            if (assignment.AssignmentUsers == null)
                assignment.AssignmentUsers = new List<AssignmentUser>();

            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();
            return assignment;
        }

        public async Task<Assignment> UpdateAsync(int assignmentId, string newTitle, string newDescription = null)
        {
            var assignment = await _context.Assignments
                .Include(a => a.AssignmentUsers)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)
                return null;

            assignment.AssignmentName = newTitle;
            if (newDescription != null)
            {
                assignment.AssignmentDescription = newDescription;
            }

            await _context.SaveChangesAsync();
            return assignment;
        }

        public async Task<bool> DeleteAsync(int assignmentId)
        {
            var assignment = await _context.Assignments
                .Include(a => a.AssignmentUsers)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)
                return false;

            // Remove related AssignmentUser entries
            if (assignment.AssignmentUsers != null)
            {
                _context.AssignmentUsers.RemoveRange(assignment.AssignmentUsers);
            }

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<AssignmentDto>> GetAllAsync()
        {
            var assignments = await _context.Assignments
                .Include(a => a.AssignmentUsers)
                .ToListAsync();

            return assignments.Select(assignment => new AssignmentDto
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
                    UserId = au.UserId,
                    AssignmentId = au.AssignmentId,
                    AssignedAt = au.AssignedAt,
                    SubmittedAt = au.SubmittedAt,
                    Grade = au.Grade
                }).ToList()
            }).ToList();
        }

        public async Task<AssignmentDto> GetByIdAsync(int assignmentId)
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
                    UserId = au.UserId,
                    AssignmentId = au.AssignmentId,
                    AssignedAt = au.AssignedAt,
                    SubmittedAt = au.SubmittedAt,
                    Grade = au.Grade
                }).ToList()
            };
        }
    }
}