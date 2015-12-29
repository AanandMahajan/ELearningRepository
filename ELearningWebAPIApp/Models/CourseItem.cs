using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ELearning.WebAPI.DBModel;
using System.Runtime.Serialization;

namespace ELearning.WebAPI.Models
{
    //[KnownType(typeof(CourseDetail))]
    //[KnownType(typeof(ChapterDetail))]
    public class CourseItem
    {
        public string BlobUrl;
        public CourseDetail Course;

        //public string BlobURL
        //{
        //    set
        //    {
        //        BlobUrl = value;
        //    }
        //    get
        //    {
        //        return BlobUrl;
        //    }
        //}
        //public CourseDetail CourseDetailItem
        //{
        //    set
        //    {
        //        Course = value;
        //    }
        //    get
        //    {
        //        return Course;
        //    }

        //}

        //public CourseItem() { }
        //public CourseItem(string BlobUrl, CourseDetail Course)
        //{
        //    this.BlobUrl = BlobUrl;
        //    this.Course = Course;
        //}
    }
}