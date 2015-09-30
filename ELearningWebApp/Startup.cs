using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ELearning.Web.Startup))]
namespace ELearning.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
