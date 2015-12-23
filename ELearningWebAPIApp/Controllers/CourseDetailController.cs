using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using ELearning.WebAPI.DBModel;
using ELearning.WebAPI.Models;
using System.Web.Script.Serialization;
using Newtonsoft.Json;

namespace ELearning.WebAPI.Controllers
{
    public class CourseDetailController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();

        [HttpGet]
        public IEnumerable<CourseItem> GetRecommendedCourseDetails()
        {            
            var response = (from course in db.CourseDetails
                            orderby course.Enrollments descending
                            select course).Take(5);
            var imageMaster = db.ImageMasters;
            List<CourseItem> courseItemList = new List<CourseItem>();
            foreach (var item in response)
            {
                 string url = (from course in imageMaster
                              where course.ID == item.CourseImageID
                              select course).First().BLOB_URL;
                courseItemList.Add(new CourseItem(url, item));
            }

            return courseItemList;
        }

        // GET api/CourseDetail
        public IEnumerable<CourseDetail> GetCourseDetails()
        {
            return db.CourseDetails.AsEnumerable();
        }

        // GET api/CourseDetail/5
        public string GetCourseDetail(int id)
        {
            CourseDetail coursedetail = db.CourseDetails.Find(id);
            if (coursedetail == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            string list = JsonConvert.SerializeObject(coursedetail,
                        Formatting.None,
                        new JsonSerializerSettings()
                        {
                                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                        });

            //return Content(list, "application/json");
            
            //string json = new JavaScriptSerializer().Serialize(coursedetail);
            return list;
        }

        // PUT api/CourseDetail/5
        public HttpResponseMessage PutCourseDetail(int id, CourseDetail coursedetail)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != coursedetail.ID)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(coursedetail).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // POST api/CourseDetail
        public HttpResponseMessage PostCourseDetail(CourseDetail coursedetail)
        {
            if (ModelState.IsValid)
            {
                db.CourseDetails.Add(coursedetail);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, coursedetail);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = coursedetail.ID }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/CourseDetail/5
        public HttpResponseMessage DeleteCourseDetail(int id)
        {
            CourseDetail coursedetail = db.CourseDetails.Find(id);
            if (coursedetail == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.CourseDetails.Remove(coursedetail);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, coursedetail);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}