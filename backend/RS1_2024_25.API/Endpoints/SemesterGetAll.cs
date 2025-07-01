using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.StudentEndpoints.SemesterGetAll;

namespace RS1_2024_25.API.Endpoints.StudentEndpoints;

[Route("semestar")]
public class SemesterGetAll(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<int>
    .WithActionResult<SemesterGetAllResponse>
{
    [HttpGet("{id}")]
    public override async Task<ActionResult<SemesterGetAllResponse>> HandleAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var semester = await db.Semestars
            .Where(s => s.StudentId == id)
            .Select(s => new SemesterGetAllResponse
            {
                Id = s.Id,
                AcademicYear = s.AcademicYear.Description,
                YearOfStudy = s.YearOfStudy,
                Renewal = s.Renewal,
                Date = s.Date,
                MyAppUser = s.MyAppUser.FirstName
            })
            .ToListAsync(cancellationToken);

        if (semester == null)
        {
            throw new KeyNotFoundException("semester not found");
        }

        return Ok(semester);
    }

    // DTO za odgovor
    public class SemesterGetAllResponse
    {
        public int Id { get; set; }
        public string AcademicYear { get; set; }
        public int YearOfStudy { get; set; }
        public bool Renewal { get; set; }
        public DateTime Date { get; set; }
        public string MyAppUser { get; set; }

    }
}
