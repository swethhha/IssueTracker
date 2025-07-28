using System.Collections.Generic;
using IssueTracker.Core.Entities;
using IssueTracker.Core.Interfaces;

namespace IssueTracker.Application.Services
{
    public class BugService
    {
        private readonly IBugRepository _repo;

        public BugService(IBugRepository repo)
        {
            _repo = repo;
        }

        public void CreateBug(string title, string description)
        {
            var bug = new Bug
            {
                Title = title,
                Description = description,
                Status = "New"
            };

            _repo.AddBug(bug);
        }

        public List<Bug> GetAllBugs() => _repo.GetAllBugs();
        public Bug GetBugById(int id) => _repo.GetBugById(id);
        public void AddBug(Bug bug) => _repo.AddBug(bug);
        public void UpdateBug(Bug bug) => _repo.UpdateBug(bug);
        public void DeleteBug(int id) => _repo.DeleteBug(id);
    }
}
