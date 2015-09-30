using System.Web.Mvc;

namespace ELearning.Web.Controllers
{
    public class RoutesDemoController : Controller
    {
        public ActionResult One()
        {
            return View();
        }

        public ActionResult Two()
        {            
            return View();
        }

        [Authorize]
        public ActionResult Three()
        {
            return View();
        }
    }
}