using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Models;
using Resend;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivateController(AppDbContext context, IResend resend) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly IResend _resend = resend;

    [HttpGet("{token}")]
    public async Task<IActionResult> ActivateAccountToAdmin(Guid token)
    {
        UserModel? user = await _context.Users.FirstOrDefaultAsync(u => u.ActivationToken == token);
        if (user == null)
        {
            return BadRequest(new { error = "User not found" });
        }

        user.Status = Status.Accepted;
        user.ActivationToken = null;

        _context.Users.Update(user);

        EmailMessage email = new()
        {
            From = "onboarding@resend.dev",
            To = user.Email,
            Subject = "You have been granted admin access",
            HtmlBody = $"Congrats {user.FirstName}, your request to become an admin was successful. To get started, log in with ${user.Email}",
        };

        Task saveToDbTask = _context.SaveChangesAsync();
        Task sendEmailTask = _resend.EmailSendAsync(email);

        try
        {
            await Task.WhenAll(saveToDbTask, sendEmailTask);
            return Ok(new { message = "User account activated successfully with admin access" });
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error: {e}");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                error = "An unexpected problem occurred"
            });
        }

    }
}
