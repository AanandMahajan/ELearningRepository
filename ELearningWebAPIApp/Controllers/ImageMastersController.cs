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
    public class ImageMastersController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();

        // GET: api/ImageMasters
        public IQueryable<ImageMaster> GetImageMasters()
        {
            return db.ImageMasters;
        }

        // GET: api/ImageMasters/5
        [ResponseType(typeof(ImageMaster))]
        public IHttpActionResult GetImageMaster(int id)
        {
            ImageMaster imageMaster = db.ImageMasters.Find(id);
            if (imageMaster == null)
            {
                return NotFound();
            }

            return Ok(imageMaster);
        }

        // PUT: api/ImageMasters/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutImageMaster(int id, ImageMaster imageMaster)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != imageMaster.ID)
            {
                return BadRequest();
            }

            db.Entry(imageMaster).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ImageMasterExists(id))
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

        // POST: api/ImageMasters
        [ResponseType(typeof(ImageMaster))]
        public IHttpActionResult PostImageMaster(ImageMaster imageMaster)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ImageMasters.Add(imageMaster);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = imageMaster.ID }, imageMaster);
        }

        // DELETE: api/ImageMasters/5
        [ResponseType(typeof(ImageMaster))]
        public IHttpActionResult DeleteImageMaster(int id)
        {
            ImageMaster imageMaster = db.ImageMasters.Find(id);
            if (imageMaster == null)
            {
                return NotFound();
            }

            db.ImageMasters.Remove(imageMaster);
            db.SaveChanges();

            return Ok(imageMaster);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ImageMasterExists(int id)
        {
            return db.ImageMasters.Count(e => e.ID == id) > 0;
        }
    }
}