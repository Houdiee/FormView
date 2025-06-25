using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Resend;
using Models;
using System.Globalization;
using Dtos;

namespace Api.Controllers;

[ApiController]
[Route("api/forms/[controller]")]
public class EnrolmentsController(
    AppDbContext context,
    IResend resend,
    IWebHostEnvironment webHostEnvironment,
    IConfiguration configuration
) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly IResend _resend = resend;
    private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;
    private readonly IConfiguration _configuration = configuration;

    [HttpPost]
    public async Task<IActionResult> SaveEnrolmentFormToDb([FromBody] EnrolmentFormRequestDto formDto)
    {
        EnrolmentForm enrolmentForm = new()
        {
            FirstName = formDto.FirstName,
            MiddleName = formDto.MiddleName ?? string.Empty,
            LastName = formDto.LastName,
            Email = formDto.Email,
            DateOfBirth = formDto.DateOfBirth.ToUniversalTime(),
            Age = formDto.Age,
            Gender = formDto.Gender,
            CountryOfBirth = formDto.CountryOfBirth,
            CountryOfCitizenship = formDto.CountryOfCitizenship,
            Siblings = formDto.Siblings?.Select(
                siblingDto => new EnrolmentFormSibling
                {
                    FirstName = siblingDto.FirstName,
                    LastName = siblingDto.LastName
                })
                .ToList() ?? new List<EnrolmentFormSibling>(),
            CreatedAt = DateTime.Now.ToUniversalTime(),
            FilePath = formDto.FilePath,
        };

        await _context.EnrolmentForms.AddAsync(enrolmentForm);

        EmailMessage email = new()
        {
            From = "FormView <no-reply@formview.org>",
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

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> ListAllEnrolmentForms([FromQuery] string? search = null)
    {
        IQueryable<EnrolmentForm> query = _context.EnrolmentForms.Include(f => f.Siblings);

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

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFormById(int id)
    {
        EnrolmentForm? form = await _context.EnrolmentForms
                                        .Include(f => f.Siblings)
                                        .FirstOrDefaultAsync(f => f.Id == id);
        if (form == null)
        {
            return BadRequest(new { error = "Form does not exist" });
        }

        return Ok(form);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateForm(int id, [FromBody] EnrolmentFormRequestDto formDto)
    {
        EnrolmentForm? existingForm = await _context.EnrolmentForms
                                                .Include(f => f.Siblings)
                                                .FirstOrDefaultAsync(f => f.Id == id);

        if (existingForm == null)
        {
            return BadRequest(new { error = "Form does not exist" });
        }

        existingForm.FirstName = formDto.FirstName;
        existingForm.MiddleName = formDto.MiddleName ?? "";
        existingForm.LastName = formDto.LastName;
        existingForm.Email = formDto.Email;
        existingForm.Gender = formDto.Gender;
        existingForm.DateOfBirth = formDto.DateOfBirth.ToUniversalTime();
        existingForm.CountryOfBirth = formDto.CountryOfBirth;
        existingForm.CountryOfCitizenship = formDto.CountryOfCitizenship;
        existingForm.Siblings = formDto.Siblings?.Select(
            siblingDto => new EnrolmentFormSibling
            {
                FirstName = siblingDto.FirstName,
                LastName = siblingDto.LastName
            })
            .ToList() ?? new List<EnrolmentFormSibling>();

        try
        {
            await _context.SaveChangesAsync();
            return Ok(existingForm);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error: {e}");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { error = "An unexpected problem occurred" }
            );
        }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteForm(int id)
    {
        EnrolmentForm? form = await _context.EnrolmentForms.FindAsync(id);
        if (form == null)
        {
            return BadRequest(new { error = "Form does not exist" });
        }

        _context.EnrolmentForms.Remove(form);
        try
        {
            await _context.SaveChangesAsync();
            return Ok(form);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error: {e}");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { error = "An unexpected problem occurred" }
            );
        }
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded or file is empty.");
        }

        try
        {
            var webRootPath = _webHostEnvironment.WebRootPath;
            var uploadDirectory = Path.Combine(webRootPath, "images");

            if (!Directory.Exists(uploadDirectory))
            {
                Directory.CreateDirectory(uploadDirectory);
            }

            string fileName = Path.GetFileNameWithoutExtension(file.FileName);
            string extension = Path.GetExtension(file.FileName);
            string newFileName = $"{fileName}_{Guid.NewGuid()}{extension}";
            string filePath = Path.Combine(uploadDirectory, newFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new
            {
                filePath = $"{_configuration["ApplicationBaseUrl"]}/images/{newFileName}",
                Message = "File uploaded successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
