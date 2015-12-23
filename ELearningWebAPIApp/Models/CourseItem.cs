using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ELearning.WebAPI.DBModel;

namespace ELearning.WebAPI.Models
{
    public class CourseItem
    {
        private string BlobUrl;
        private CourseDetail Course;

        public string BlobURL
        {
            set
            {
                BlobUrl = value;
            }
            get
            {
                return BlobUrl;
            }
        }
        public CourseDetail CourseDetailItem
        {
            set
            {
                Course = value;
            }
            get
            {
                return Course;
            }

        }

        public CourseItem() { }
        public CourseItem(string BlobUrl, CourseDetail Course)
        {
            this.BlobUrl = BlobUrl;
            this.Course = Course;
        }
    }
}