using FileUploader.Helper;
using FileUploader.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace FileUploader.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            var controllerActions = ControllerActionHelper.GetControllerActionsWithRoutes();

            foreach (var controller in controllerActions)
            {
                Console.WriteLine($"Controller Name: {controller.Key}");
                Console.WriteLine("Actions:");

                foreach (var action in controller.Value)
                {
                    Console.WriteLine($"\t{action}");
                }
            }

            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}