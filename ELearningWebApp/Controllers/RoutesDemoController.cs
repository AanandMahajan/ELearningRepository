using System.Web.Mvc;

namespace ELearning.Web.Controllers
{
    public class RoutesDemoController : Controller
    {
        public ActionResult Search()
        {
            return View();
        }

        public ActionResult Home()
        {            
            return View();
        }
                
        public ActionResult CourseDetails()
        {
            return View();
        }
    }
}