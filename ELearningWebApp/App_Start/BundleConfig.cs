using System.Web.Optimization;

namespace ELearning.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/ELearning.Web/")
                .IncludeDirectory("~/Scripts/Controllers", "*.js")
                .IncludeDirectory("~/Scripts/Factories", "*.js")
                .IncludeDirectory("~/Scripts/js", "*.js")
                .Include("~/Scripts/ELearning.Web.js"));

            bundles.Add(new StyleBundle("~/Content/css")
                      .Include("~/Content/site.css")
                      .IncludeDirectory("~/Scripts/css", "*.css")


                      );

            BundleTable.EnableOptimizations = true;
        }
    }
}