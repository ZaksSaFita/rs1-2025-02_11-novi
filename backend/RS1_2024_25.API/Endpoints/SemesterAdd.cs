using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.CityEndpoints.SemesterAdd;

namespace RS1_2024_25.API.Endpoints.CityEndpoints;

[Route("semestar")]
public class SemesterAdd(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<SemesterAddRequest>
    .WithActionResult<int>
{
    [HttpPost]  // Using POST to support both create and update
    public override async Task<ActionResult<int>> HandleAsync([FromBody] SemesterAddRequest request, CancellationToken cancellationToken = default)
    {

        // Check if we're performing an insert or update based on the ID value
        bool isInsert = (request.Id == null || request.Id == 0);
        Semestar? semestar;

        if (isInsert)
        {
            // Insert operation: create a new city entity
            semestar = new Semestar();
            db.Semestars.Add(semestar); // Add the new city to the context
        }
        else
        {
            // Update operation: retrieve the existing city
            semestar = await db.Semestars.SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (semestar == null)
            {
                return NotFound("City not found");
            }
        }
        semestar.Date = request.Date;
        semestar.YearOfStudy = request.YearOfStudy;
        semestar.AcademicYearId = request.AcademicYearId;
        semestar.Price = request.Price;
        semestar.Renewal = request.Renewal;
        semestar.MyAppUserId = request.MyAppUserId;
        semestar.StudentId = request.StudentId;



        // Save changes to the database
        await db.SaveChangesAsync(cancellationToken);

        return Ok(semestar.Id);
    }

    public class SemesterAddRequest
    {
        public int? Id { get; set; }
        public DateTime Date { get; set; }
        public int YearOfStudy { get; set; }
        public int AcademicYearId { get; set; }
        public float Price { get; set; }
        public bool Renewal { get; set; }
        public int MyAppUserId { get; set; }
        public int StudentId { get; set; }

    }
}
