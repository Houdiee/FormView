using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Resend;
using Models;
using System.Globalization;
using Dtos;

namespace Api.Controllers;

[ApiController]
[Route("api/forms/[controller]")]
public class FormsController(AppDbContext context, IResend resend) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly IResend _resend = resend;

    [HttpPost]
    public async Task<IActionResult> SaveEnrolmentFormToDb([FromBody] EnrolmentFormRequestDto formDto)
    {
        EnrolmentForm enrolmentForm = new()
        {
            FirstName = formDto.FirstName,
            MiddleName = formDto.MiddleName ?? string.Empty,
            LastName = formDto.LastName,
            Email = formDto.Email,
            DateOfBirth = DateTime.ParseExact(formDto.DateOfBirth, "dd/MM/yyyy", CultureInfo.InvariantCulture),
            Age = formDto.Age,
            Gender = formDto.Gender,
            CountryOfBirth = formDto.CountryOfBirth,
            CountryOfCitizenship = formDto.CountryOfCitizenship,
            Siblings = formDto.Siblings.Select(s => $"{s.Item1} {s.Item2}").ToList(),
            CreatedAt = DateTime.Now,
        };

        await _context.EnrolmentForms.AddAsync(enrolmentForm);

        EmailMessage email = new()
        {
            From = "onboarding@resend.dev",
            To = formDto.Email,
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

    [HttpGet]
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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetFormById(int id)
    {
        EnrolmentForm? form = await _context.EnrolmentForms.FindAsync(id);
        if (form == null)
        {
            return BadRequest(new { error = "Form does not exist" });
        }

        return Ok(form);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateForm(int id, [FromBody] EnrolmentFormRequestDto formDto)
    {
        EnrolmentForm? existingForm = await _context.EnrolmentForms.FindAsync(id);
        if (existingForm == null)
        {
            return BadRequest(new { error = "Form does not exist" });
        }

        existingForm.FirstName = formDto.FirstName;
        existingForm.MiddleName = formDto.MiddleName ?? "";
        existingForm.LastName = formDto.LastName;
        existingForm.Email = formDto.Email;
        existingForm.Gender = formDto.Gender;
        existingForm.CountryOfBirth = formDto.CountryOfBirth;
        existingForm.CountryOfCitizenship = formDto.CountryOfCitizenship;
        existingForm.Siblings = formDto.Siblings.Select(s => $"{s.Item1} {s.Item2}").ToList();

        return Ok(existingForm);
    }
}
