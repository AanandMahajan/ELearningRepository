using System.Data.Entity;
using ELearning.WebAPI.DBModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace ELearning.WebAPI.Models
{
    public class DatabaseContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, add the following
        // code to the Application_Start method in your Global.asax file.
        // Note: this will destroy and re-create your database with every model change.
        // 
        // System.Data.Entity.Database.SetInitializer(new System.Data.Entity.DropCreateDatabaseIfModelChanges<ELearning.WebAPI.Models.DatabaseContext>());

        public DatabaseContext() : base("name=DatabaseContext")
        {
            base.Configuration.ProxyCreationEnabled = false;
            Database.SetInitializer<DatabaseContext>(null);
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<CourseDetail>().ToTable("CourseDetail");
            modelBuilder.Entity<ChapterDetail>().ToTable("ChapterDetail");
            modelBuilder.Entity<ChapterContent>().ToTable("ChapterContent");
            modelBuilder.Entity<CategoryMaster>().ToTable("CategoryMaster");
            modelBuilder.Entity<ImageMaster>().ToTable("ImageMaster");
            modelBuilder.Entity<CourseLikeUnlikeView>().ToTable("CourseLikeUnlikeView");

            modelBuilder.Entity<CountryMaster>().ToTable("CountryMaster");
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Entity<CourseLikeUnlikeView>().HasKey(t => t.ID);
            // Configure the primary key for BaseCard
            modelBuilder.Entity<ChapterDetail>().HasKey(t => t.ID);
            //specify no autogenerate the Id Column
            //modelBuilder.Entity<ChapterDetail>().Property(b => b.ID).HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            //one-to-many relationship 
            modelBuilder.Entity<ChapterContent>().HasRequired(c => c.ChapterDetail)
                    .WithMany(s => s.ChapterContents)
                    .HasForeignKey(c => c.ChapterID);


            // Configure the primary key for BaseCard
            modelBuilder.Entity<CourseDetail>().HasKey(t => t.ID);
            //specify no autogenerate the Id Column
            //modelBuilder.Entity<CourseDetail>().Property(b => b.ID).HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            //one-to-many relationship 
            modelBuilder.Entity<ChapterDetail>().HasRequired(c => c.CourseDetail)
                    .WithMany(s => s.ChapterDetails)
                    .HasForeignKey(c => c.CourseID);
            

            base.OnModelCreating(modelBuilder);


        }
        public DbSet<User> Users { get; set; }

        public DbSet<CourseDetail> CourseDetails { get; set; }

        public DbSet<CategoryMaster> CategoryMasters { get; set; }

        public DbSet<CountryMaster> CountryMasters { get; set; }

        public System.Data.Entity.DbSet<ELearning.WebAPI.DBModel.ImageMaster> ImageMasters { get; set; }

        public System.Data.Entity.DbSet<ELearning.WebAPI.DBModel.CourseLikeUnlikeView> CourseLikeUnlikeViews { get; set; }

    }
}
