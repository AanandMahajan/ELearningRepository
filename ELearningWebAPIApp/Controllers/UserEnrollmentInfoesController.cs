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
    public class UserEnrollmentInfoesController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();

        // GET: api/UserEnrollmentInfoes
        public IQueryable<UserEnrollmentInfo> GetUserEnrollmentInfoes()
        {
            return db.UserEnrollmentInfoes;
        }

        // GET: api/UserEnrollmentInfoes/5
        [ResponseType(typeof(UserEnrollmentInfo))]
        public IHttpActionResult GetUserEnrollmentInfo(int id)
        {
            UserEnrollmentInfo userEnrollmentInfo = db.UserEnrollmentInfoes.Find(id);
            if (userEnrollmentInfo == null)
            {
                return NotFound();
            }

            return Ok(userEnrollmentInfo);
        }

        // PUT: api/UserEnrollmentInfoes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUserEnrollmentInfo(int id, UserEnrollmentInfo userEnrollmentInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userEnrollmentInfo.ID)
            {
                return BadRequest();
            }

            db.Entry(userEnrollmentInfo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserEnrollmentInfoExists(id))
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

        // POST: api/UserEnrollmentInfoes
        [ResponseType(typeof(UserEnrollmentInfo))]
        public IHttpActionResult PostUserEnrollmentInfo(UserEnrollmentInfo userEnrollmentInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserEnrollmentInfoes.Add(userEnrollmentInfo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = userEnrollmentInfo.ID }, userEnrollmentInfo);
        }

        // DELETE: api/UserEnrollmentInfoes/5
        [ResponseType(typeof(UserEnrollmentInfo))]
        public IHttpActionResult DeleteUserEnrollmentInfo(int id)
        {
            UserEnrollmentInfo userEnrollmentInfo = db.UserEnrollmentInfoes.Find(id);
            if (userEnrollmentInfo == null)
            {
                return NotFound();
            }

            db.UserEnrollmentInfoes.Remove(userEnrollmentInfo);
            db.SaveChanges();

            return Ok(userEnrollmentInfo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserEnrollmentInfoExists(int id)
        {
            return db.UserEnrollmentInfoes.Count(e => e.ID == id) > 0;
        }
    }
}