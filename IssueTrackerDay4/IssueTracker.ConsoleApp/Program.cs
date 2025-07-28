using System;
using IssueTracker.Application.Services;
using IssueTracker.Core.Entities;
using IssueTracker.Infrastructure.Repositories;

namespace IssueTracker.ConsoleApp
{
    public class Program
    {
        static void Main(string[] args)
        {
            var bugRepository = new BugRepository();
            var bugService = new BugService(bugRepository);

            // Create bugs
            bugService.CreateBug("Login Bug", "User cannot login.");
            bugService.CreateBug("UI Bug", "Button not visible on the screen.");

            var bugs = bugService.GetAllBugs();

            Console.WriteLine("List of Bugs:");
            foreach (var bug in bugs)
            {
                Console.WriteLine($"ID: {bug.Id}, Title: {bug.Title}, Description: {bug.Description}, Status: {bug.Status}");
            }

            Console.ReadLine();
        }
    }
}


