using FluentValidation;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Endpoints.CityEndpoints;

public class SemestarAddValidator : AbstractValidator<SemesterAdd.SemesterAddRequest>
{
    public SemestarAddValidator(ApplicationDbContext dbContext)
    {

        // Validacija StudentNumber
        RuleFor(x => x.YearOfStudy)
            .Must(year => year >= 1 && year <= 5)
           .WithMessage("qme nemew 0 i nemere vise od 6.");


        RuleFor(x => x)
            .Must(request =>
            {
                if (request.AcademicYearId > 0 && request.YearOfStudy > 0)
                {
                    return !dbContext.Semestars.Any(s =>
                        s.AcademicYearId == request.AcademicYearId &&
                        s.StudentId == request.StudentId
                        && (request.Id != s.Id || request.Id == null)
                        );
                }
                return true;
            })
            .WithMessage("Opština rođenja nije validna.");


    }
}
