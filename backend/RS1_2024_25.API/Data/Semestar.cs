using RS1_2024_25.API.Data.Models.SharedTables;
using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul1_Auth;
using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul2_Basic;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data
{
    public class Semestar
    {
        public int Id { get; set; }
        public int YearOfStudy { get; set; }

        public DateTime Date { get; set; }
        public int AcademicYearId { get; set; }
        [ForeignKey(nameof(AcademicYearId))]
        public AcademicYear AcademicYear { get; set; }

        public float Price { get; set; }

        public bool Renewal { get; set; }



        public int MyAppUserId { get; set; }
        [ForeignKey(nameof(MyAppUserId))]
        public MyAppUser MyAppUser { get; set; }

        public int StudentId { get; set; }
        [ForeignKey(nameof(StudentId))]
        public Student Student { get; set; }
    }
}
