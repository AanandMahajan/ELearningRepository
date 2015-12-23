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
    public class CategoryMastersController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();

        public IQueryable<CategoryMaster> getTopCategory()
        {
            var categoryList = (from cat in db.CategoryMasters
                               orderby cat.Category descending
                               select cat).Take(7);

            //To get total nof courses and enrollment categorywise
            //var temp = categoryList
            //            .GroupBy(l => l.CategoryID)
            //            .Select(cl => new CategoryMisc 
            //            { 
            //                CategoryId = cl.Key,
            //                NoOfCourses = cl.Count(),
            //                NoOfEnrollment = (int)cl.Sum(c => c.Enrollments) 
            //            });
            return categoryList;
        }

        // GET: api/CategoryMasters
        public IQueryable<CategoryMaster> GetCategoryMasters()
        {
            return db.CategoryMasters;
        }

        // GET: api/CategoryMasters/5
        [ResponseType(typeof(CategoryMaster))]
        public IHttpActionResult GetCategoryMaster(int id)
        {
            CategoryMaster categoryMaster = db.CategoryMasters.Find(id);
            if (categoryMaster == null)
            {
                return NotFound();
            }

            return Ok(categoryMaster);
        }

        // PUT: api/CategoryMasters/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCategoryMaster(int id, CategoryMaster categoryMaster)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != categoryMaster.ID)
            {
                return BadRequest();
            }

            db.Entry(categoryMaster).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryMasterExists(id))
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

        // POST: api/CategoryMasters
        [ResponseType(typeof(CategoryMaster))]
        public IHttpActionResult PostCategoryMaster(CategoryMaster categoryMaster)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CategoryMasters.Add(categoryMaster);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = categoryMaster.ID }, categoryMaster);
        }

        // DELETE: api/CategoryMasters/5
        [ResponseType(typeof(CategoryMaster))]
        public IHttpActionResult DeleteCategoryMaster(int id)
        {
            CategoryMaster categoryMaster = db.CategoryMasters.Find(id);
            if (categoryMaster == null)
            {
                return NotFound();
            }

            db.CategoryMasters.Remove(categoryMaster);
            db.SaveChanges();

            return Ok(categoryMaster);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CategoryMasterExists(int id)
        {
            return db.CategoryMasters.Count(e => e.ID == id) > 0;
        }
    }
}