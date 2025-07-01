namespace RS1_2024_25.API.Endpoints.StudentEndpoints;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Threading;
using System.Threading.Tasks;

[MyAuthorization(isAdmin: true, isManager: false)]
[Route("students")]
public class StudentDeleteEndpoint(ApplicationDbContext db, IMyAuthService authService) : MyEndpointBaseAsync
    .WithRequest<int>
    .WithoutResult
{
    [HttpDelete("{id}")]
    public override async Task HandleAsync(int id, CancellationToken cancellationToken = default)
    {
        var student = await db.Students.SingleOrDefaultAsync(x => x.ID == id, cancellationToken);
        var authInfo = authService.GetAuthInfoFromRequest();
        var userName = authInfo?.FirstName;

        if (student == null)
            throw new KeyNotFoundException("Student not found");

        if (student.IsDeleted)
            throw new Exception("Student is already deleted");

        // Soft-delete
        student.IsDeleted = true;
        student.DeletedBy = userName;
        student.DeletedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
    }
}
