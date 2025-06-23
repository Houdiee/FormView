using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Resend;
using Models;
using System.Globalization;
using Dtos;

namespace Api.Controllers;

[ApiController]
[Route("api/forms/enrolments")]
public class EnrolmentFormController(AppDbContext context, IResend resend) : ControllerBase
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
            DateOfBirth = DateTime.ParseExact(formDto.DateOfBirth, "dd/MM/yyyy", CultureInfo.InvariantCulture).ToUniversalTime(),
            Age = formDto.Age,
            Gender = formDto.Gender,
            CountryOfBirth = formDto.CountryOfBirth,
            CountryOfCitizenship = formDto.CountryOfCitizenship,
            Siblings = formDto.Siblings.Select(static s => s.FirstName + ' ' + s.LastName).ToList(),
            CreatedAt = DateTime.Now.ToUniversalTime(),
        };

        await _context.EnrolmentForms.AddAsync(enrolmentForm);

        EmailMessage email = new()
        {
            From = "no-reply@formview.org",
            To = formDto.Email,
            Subject = "We have received your enrolment form",
            HtmlBody = "<p>Your enrolment is currently up for review.</p>",
        };

        Task saveToDbTask = _context.SaveChangesAsync();
        Task sendEmailTask = _resend.EmailSendAsync(email);

        try
        {
            await Task.WhenAll(sendEmailTask, saveToDbTask);
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
    public async Task<IActionResult> ListAllEnrolmentForms([FromQuery] string? search = null)
    {
        IQueryable<EnrolmentForm> query = _context.EnrolmentForms;

        if (!string.IsNullOrEmpty(search))
        {
            search = search.ToLower();
            query = query.Where(f =>
                f.FirstName.ToLower().Contains(search)
                ||
                (f.MiddleName != null && f.MiddleName.ToLower().Contains(search))
                ||
                f.LastName.ToLower().Contains(search)
                ||
                f.Email.ToLower().Contains(search)
            );
        }

        query = query.OrderByDescending(f => f.CreatedAt);

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
        existingForm.Siblings = formDto.Siblings.Select(static s => s.FirstName + ' ' + s.LastName).ToList();

        return Ok(existingForm);
    }
}
