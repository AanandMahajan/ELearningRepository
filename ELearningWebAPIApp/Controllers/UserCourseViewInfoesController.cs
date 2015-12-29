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
    public class UserCourseViewInfoesController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();

        // GET: api/UserCourseViewInfoes
        public IQueryable<UserCourseViewInfo> GetUserCourseViewInfoes()
        {
            return db.UserCourseViewInfoes;
        }

        // GET: api/UserCourseViewInfoes/5
        [ResponseType(typeof(UserCourseViewInfo))]
        public IHttpActionResult GetUserCourseViewInfo(int id)
        {
            UserCourseViewInfo userCourseViewInfo = db.UserCourseViewInfoes.Find(id);
            if (userCourseViewInfo == null)
            {
                return NotFound();
            }

            return Ok(userCourseViewInfo);
        }

        // PUT: api/UserCourseViewInfoes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUserCourseViewInfo(int id, UserCourseViewInfo userCourseViewInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userCourseViewInfo.ID)
            {
                return BadRequest();
            }

            db.Entry(userCourseViewInfo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserCourseViewInfoExists(id))
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

        // POST: api/UserCourseViewInfoes
        [ResponseType(typeof(UserCourseViewInfo))]
        public IHttpActionResult PostUserCourseViewInfo(UserCourseViewInfo userCourseViewInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserCourseViewInfoes.Add(userCourseViewInfo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = userCourseViewInfo.ID }, userCourseViewInfo);
        }

        // DELETE: api/UserCourseViewInfoes/5
        [ResponseType(typeof(UserCourseViewInfo))]
        public IHttpActionResult DeleteUserCourseViewInfo(int id)
        {
            UserCourseViewInfo userCourseViewInfo = db.UserCourseViewInfoes.Find(id);
            if (userCourseViewInfo == null)
            {
                return NotFound();
            }

            db.UserCourseViewInfoes.Remove(userCourseViewInfo);
            db.SaveChanges();

            return Ok(userCourseViewInfo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserCourseViewInfoExists(int id)
        {
            return db.UserCourseViewInfoes.Count(e => e.ID == id) > 0;
        }
    }
}