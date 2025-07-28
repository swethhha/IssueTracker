using System.Collections.Generic;
using System.Linq;
using IssueTracker.Core.Entities;
using IssueTracker.Core.Interfaces;

namespace IssueTracker.Infrastructure.Repositories
{
    public class BugRepository : IBugRepository
    {
        private readonly List<Bug> _bugs = new List<Bug>();

        public void AddBug(Bug bug)
        {
            bug.Id = _bugs.Count + 1;
            _bugs.Add(bug);
        }

        public List<Bug> GetAllBugs() => _bugs;

        public Bug GetBugById(int id) => _bugs.FirstOrDefault(b => b.Id == id);

        public void UpdateBug(Bug bug)
        {
            var index = _bugs.FindIndex(b => b.Id == bug.Id);
            if (index != -1)
            {
                _bugs[index] = bug;
            }
        }

        public void DeleteBug(int id)
        {
            var bug = GetBugById(id);
            if (bug != null)
            {
                _bugs.Remove(bug);
            }
        }
    }
}
