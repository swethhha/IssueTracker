using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IssueTracker.Core.Entities;

using System.Collections.Generic;
using IssueTracker.Core.Entities;

namespace IssueTracker.Core.Interfaces
{
    public interface IBugRepository
    {
        List<Bug> GetAllBugs();
        Bug GetBugById(int id);
        void AddBug(Bug bug);
        void UpdateBug(Bug bug);
        void DeleteBug(int id);
    }
}
