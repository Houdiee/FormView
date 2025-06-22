using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Resend;
using Models;
using System.Globalization;
using Dtos;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FormsController(AppDbContext context, IResend resend) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly IResend _resend = resend;

    [HttpPost("enrolment")]
    public async Task<IActionResult> SaveEnrolmentFormToDb([FromBody] EnrolmentFormRequestDto form)
    {
        EnrolmentForm enrolmentForm = new()
        {
            FirstName = form.FirstName,
            MiddleName = form.MiddleName ?? string.Empty,
            LastName = form.LastName,
            Email = form.Email,
            DateOfBirth = DateTime.ParseExact(form.DateOfBirth, "dd/MM/yyyy", CultureInfo.InvariantCulture),
            Age = form.Age,
            Gender = form.Gender,
            CountryOfBirth = form.CountryOfBirth,
            CountryOfCitizenship = form.CountryOfCitizenship,
            Siblings = form.Siblings,
            CreatedAt = DateTime.Now,
        };

        await _context.EnrolmentForms.AddAsync(enrolmentForm);

        EmailMessage email = new()
        {
            From = "onboarding@resend.dev",
            To = form.Email,
            Subject = "We have received your enrolment form",
            HtmlBody = "<p>Your enrolment is currently up for review.</p>",
        };

        Task saveToDbTask = _context.SaveChangesAsync();
        Task sendEmailTask = _resend.EmailSendAsync(email);

        try
        {
            await Task.WhenAll(saveToDbTask, sendEmailTask);
            return Ok(new { message = "Form uploaded successfully" });
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error: {e}");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                error = "An unexpected problem occurred",
            });
        }
    }

    [HttpGet("enrolment")]
    public async Task<IActionResult> ListAllEnrolmentForms(
        [FromQuery] string sortBy = "createdAt",
        [FromQuery] string sortOrder = "desc",
        [FromQuery] string? search = null
    )
    {
        IQueryable<EnrolmentForm> query = _context.EnrolmentForms;

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(f =>
                f.FirstName.Contains(search, StringComparison.OrdinalIgnoreCase)
                ||
                f.MiddleName.Contains(search, StringComparison.OrdinalIgnoreCase)
                ||
                f.LastName.Contains(search, StringComparison.OrdinalIgnoreCase)
                ||
                f.Email.Contains(search, StringComparison.OrdinalIgnoreCase)
            );
        }

        bool isDescending = sortOrder == "desc";
        switch (sortBy)
        {
            case "firstname":
                query = isDescending ? query.OrderByDescending(f => f.FirstName) : query.OrderBy(f => f.FirstName);
                break;
            case "lastname":
                query = isDescending ? query.OrderByDescending(f => f.LastName) : query.OrderBy(f => f.LastName);
                break;
            case "email":
                query = isDescending ? query.OrderByDescending(f => f.Email) : query.OrderBy(f => f.Email);
                break;
            case "age":
                query = isDescending ? query.OrderByDescending(f => f.Age) : query.OrderBy(f => f.Age);
                break;
            case "gender":
                query = isDescending ? query.OrderByDescending(f => f.Gender) : query.OrderBy(f => f.Gender);
                break;
            case "countryofbirth":
                query = isDescending ? query.OrderByDescending(f => f.CountryOfBirth) : query.OrderBy(f => f.CountryOfBirth);
                break;
            case "countryofcitizenship":
                query = isDescending ? query.OrderByDescending(f => f.CountryOfCitizenship) : query.OrderBy(f => f.CountryOfCitizenship);
                break;
            case "dateofbirth":
                query = isDescending ? query.OrderByDescending(f => f.DateOfBirth) : query.OrderBy(f => f.DateOfBirth);
                break;
            case "createdat":
            default:
                query = isDescending ? query.OrderByDescending(f => f.CreatedAt) : query.OrderBy(f => f.CreatedAt);
                break;
        }

        List<EnrolmentForm> enrolmentForms = await query.ToListAsync();

        return Ok(enrolmentForms);
    }
}
