using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.CityEndpoints.AcademicYears;

namespace RS1_2024_25.API.Endpoints.CityEndpoints;

//bez paging i bez filtera
[Route("academic")]
public class AcademicYears(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<AcademicYearsResponse[]>
{
    [HttpGet("all")]
    public override async Task<AcademicYearsResponse[]> HandleAsync(CancellationToken cancellationToken = default)
    {
        var result = await db.AcademicYears
                        .Select(c => new AcademicYearsResponse
                        {
                            ID = c.ID,
                            Name = c.Description,

                        })
                        .ToArrayAsync(cancellationToken);

        return result;
    }

    public class AcademicYearsResponse
    {
        public required int ID { get; set; }
        public required string Name { get; set; }

    }
}