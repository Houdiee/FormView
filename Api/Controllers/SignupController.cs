using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Resend;
using Dtos;
using Models;

namespace Api.Controllers;

[ApiController]
[Route("api/pending/[controller]")]
public class SignupController(
    AppDbContext context,
    IConfiguration configuration,
    IResend resend,
    IPasswordHasher<UserModel> passwordHasher
) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly IConfiguration _configuration = configuration;
    private readonly IResend _resend = resend;
    private readonly IPasswordHasher<UserModel> _passwordHasher = passwordHasher;

    [HttpPost]
    public async Task<IActionResult> SignupAndRequestAdminAccess([FromBody] SignupRequestDto req)
    {
        UserModel? existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);

        if (existingUser != null)
        {
            if (existingUser.Status == Status.Pending)
            {
                return BadRequest(new { error = "User has already requested to become an admin" });
            }
            else if (existingUser.Status == Status.Accepted)
            {
                return BadRequest(new { error = "User is already an admin" });
            }
        }

        UserModel newUser = new()
        {
            FirstName = req.FirstName,
            LastName = req.LastName,
            Email = req.Email,
            Status = Status.Pending,
            ActivationToken = Guid.NewGuid(),
        };
        newUser.HashedPassword = _passwordHasher.HashPassword(newUser, req.Password);

        await _context.Users.AddAsync(newUser);

        string accessLink = _configuration["ApplicationBaseUrl"]! + $"/api/activate/{newUser.ActivationToken}";

        EmailMessage email = new()
        {
            From = "FormView <no-reply@formview.org>",
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
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                error = "An unexpected problem occurred",
            });
        }

        return Ok(new { message = "Request submitted succesfully" });
    }
}
