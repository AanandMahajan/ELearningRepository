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
    public class CourseLikeUnlikeViewsController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();

        // GET: api/CourseLikeUnlikeViews
        public IQueryable<CourseLikeUnlikeView> GetCourseLikeUnlikeViews()
        {
            return db.CourseLikeUnlikeViews;
        }

        // GET: api/CourseLikeUnlikeViews/5
        [ResponseType(typeof(CourseLikeUnlikeView))]
        public IHttpActionResult GetCourseLikeUnlikeView(int id)
        {
            CourseLikeUnlikeView courseLikeUnlikeView = db.CourseLikeUnlikeViews.Find(id);
            if (courseLikeUnlikeView == null)
            {
                return NotFound();
            }

            return Ok(courseLikeUnlikeView);
        }

        // PUT: api/CourseLikeUnlikeViews/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCourseLikeUnlikeView(int id, CourseLikeUnlikeView courseLikeUnlikeView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != courseLikeUnlikeView.ID)
            {
                return BadRequest();
            }

            db.Entry(courseLikeUnlikeView).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseLikeUnlikeViewExists(id))
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

        // POST: api/CourseLikeUnlikeViews
        [ResponseType(typeof(CourseLikeUnlikeView))]
        public IHttpActionResult PostCourseLikeUnlikeView(CourseLikeUnlikeView courseLikeUnlikeView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CourseLikeUnlikeViews.Add(courseLikeUnlikeView);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = courseLikeUnlikeView.ID }, courseLikeUnlikeView);
        }

        [ActionName("validatelike")]
        [HttpGet]
        public CourseLikeUnlikeView GetCourseLikeData(int ID)
        {
            var res = from obj in db.CourseLikeUnlikeViews where obj.ActionBy == ID && obj.Flag == 1 select obj;
            CourseLikeUnlikeView courselike = res.FirstOrDefault();

            if (courselike == null)
            {
                return null;
            }
            else
            {
                return res.FirstOrDefault();
            }
            
        }



        // DELETE: api/CourseLikeUnlikeViews/5
        [ResponseType(typeof(CourseLikeUnlikeView))]
        public IHttpActionResult DeleteCourseLikeUnlikeView(int id)
        {
            CourseLikeUnlikeView courseLikeUnlikeView = db.CourseLikeUnlikeViews.Find(id);
            if (courseLikeUnlikeView == null)
            {
                return NotFound();
            }

            db.CourseLikeUnlikeViews.Remove(courseLikeUnlikeView);
            db.SaveChanges();

            return Ok(courseLikeUnlikeView);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CourseLikeUnlikeViewExists(int id)
        {
            return db.CourseLikeUnlikeViews.Count(e => e.ID == id) > 0;
        }
    }
}