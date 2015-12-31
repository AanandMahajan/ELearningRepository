using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using ELearning.WebAPI.DBModel;
using ELearning.WebAPI.Models;

namespace ELearning.WebAPI.Controllers
{
    public class UserCourseLikeInfoesController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();

        // GET: api/UserCourseLikeInfoes
        public IQueryable<UserCourseLikeInfo> GetUserCourseLikeInfoes()
        {
            return db.UserCourseLikeInfoes;
        }

        // GET: api/UserCourseLikeInfoes/5
        [ResponseType(typeof(UserCourseLikeInfo))]
        public IHttpActionResult GetUserCourseLikeInfo(int id)
        {
            UserCourseLikeInfo userCourseLikeInfo = db.UserCourseLikeInfoes.Find(id);
            if (userCourseLikeInfo == null)
            {
                return NotFound();
            }

            return Ok(userCourseLikeInfo);
        }

        // PUT: api/UserCourseLikeInfoes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUserCourseLikeInfo(int id, UserCourseLikeInfo userCourseLikeInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userCourseLikeInfo.ID)
            {
                return BadRequest();
            }

            db.Entry(userCourseLikeInfo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserCourseLikeInfoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/UserCourseLikeInfoes
        [ActionName("UserLikeInfo")]
        [HttpPost]
        [ResponseType(typeof(UserCourseLikeInfo))]
        public IHttpActionResult PostUserLikeInfo(UserCourseLikeInfo userCourseLikeInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
                       
            var userViewList = (from cat in db.UserCourseViewInfoes
                                where cat.CourseID == userCourseLikeInfo.CourseID && cat.UserID == userCourseLikeInfo.UserID
                                select cat);

            //List<UserCourseViewInfo> lst = userViewList.ToList();
            UserCourseViewInfo userCourseViewInfo = new UserCourseViewInfo();
            if(!userViewList.Any())
            {
                //Add User information in View list                
                userCourseViewInfo.CategoryID = userCourseLikeInfo.CategoryID;
                userCourseViewInfo.CourseID = userCourseLikeInfo.CourseID;
                userCourseViewInfo.TenantID = userCourseLikeInfo.TenantID;
                userCourseViewInfo.UserID = userCourseLikeInfo.UserID;
                userCourseViewInfo.ViewDate = DateTime.Now;

                db.UserCourseViewInfoes.Add(userCourseViewInfo);
                db.SaveChanges();
                
            }

            var userLikeList = (from cat in db.UserCourseLikeInfoes
                                where cat.CourseID == userCourseLikeInfo.CourseID && cat.UserID == userCourseLikeInfo.UserID
                                select cat);

            var userEnrollmentInfo = (from cat in db.UserEnrollmentInfoes
                                where cat.CourseID == userCourseLikeInfo.CourseID && cat.UserID == userCourseLikeInfo.UserID
                                select cat);

            List<Object> lst = new List<object>();
            lst.Add(userLikeList);
            lst.Add(userEnrollmentInfo);
            lst.Add(userCourseViewInfo);
            
            return CreatedAtRoute("DefaultApi", new { id = userCourseLikeInfo.ID }, lst);
        }
        [ActionName("SaveUserLike")]
        [HttpPost]
        // POST: api/UserCourseLikeInfoes
        [ResponseType(typeof(UserCourseLikeInfo))]
        public IHttpActionResult PostUserCourseLikeInfo(UserCourseLikeInfo userCourseLikeInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserCourseLikeInfoes.Add(userCourseLikeInfo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = userCourseLikeInfo.ID }, userCourseLikeInfo);
        }

        // DELETE: api/UserCourseLikeInfoes/5
        [ActionName("DeleteUserLike")]
        [HttpPost]
        [ResponseType(typeof(UserCourseLikeInfo))]
        public IHttpActionResult PostDropUserCourseLike(UserCourseLikeInfo id)
        {
            UserCourseLikeInfo userCourseLikeInfo = db.UserCourseLikeInfoes.Find(id.ID);
            if (userCourseLikeInfo == null)
            {
                return NotFound();
            }

            db.UserCourseLikeInfoes.Remove(userCourseLikeInfo);
            db.SaveChanges();

            return Ok(userCourseLikeInfo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserCourseLikeInfoExists(int id)
        {
            return db.UserCourseLikeInfoes.Count(e => e.ID == id) > 0;
        }
    }
}