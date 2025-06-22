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
    public async Task<IActionResult> ListAllEnrolmentForms(string filter = "default")
    {
        List<EnrolmentForm> enrolmentForms = _context.EnrolmentForms.ToList();

        switch (filter)
        {
            case "default":
                enrolmentForms.OrderBy(f => f.);
                break;
        }
    }
}
