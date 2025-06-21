using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Resend;
using Dtos;
using Models;

namespace Api.Controllers;

[ApiController]
[Route("api/pending/[controller]")]
public class SignupController(AppDbContext context, IConfiguration configuration, IResend resend) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly IConfiguration _configuration = configuration;
    private readonly IResend _resend = resend;

    [HttpPost]
    public async Task<IActionResult> SignupAndRequestAdminAccess([FromBody] SignupRequestDto req)
    {
        User? existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (existingUser != null && existingUser.Status == Status.Pending)
        {
            return Conflict("User has already requested to become an admin");
        }

        User newUser = new()
        {
            FirstName = req.FirstName,
            LastName = req.LastName,
            Email = req.Email,
            Status = Status.Pending,
            ActivationToken = Guid.NewGuid(),
        };

        await _context.Users.AddAsync(newUser);

        string accessLink = _configuration["ApplicationBaseUrl"]! + $"/api/activate/{newUser.ActivationToken}";

        EmailMessage email = new()
        {
            From = "onboarding@resend.dev",
            To = _configuration["OwnerEmail"]!,
            Subject = $"{req.FirstName} {req.LastName} is requesting admin access",
            HtmlBody = $"<p>Click <a href={accessLink}>here</a> to grant {req.Email} admin access.</p>",
        };

        Task saveToDbTask = _context.SaveChangesAsync();
        Task sendEmailTask = _resend.EmailSendAsync(email);

        try
        {
            await Task.WhenAll(saveToDbTask, sendEmailTask);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error: {e}");
            return StatusCode((int)HttpStatusCode.InternalServerError, new
            {
                error = "An unexpected problem occurred",
            });
        }

        return Ok(new { message = "Request submitted succesfully" });
    }
}
