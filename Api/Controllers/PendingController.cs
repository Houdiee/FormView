using Microsoft.AspNetCore.Mvc;
using Resend;
using Dtos;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PendingController(IResend resend) : ControllerBase
{
    private readonly IResend _resend = resend;

    [HttpPost("email")]
    public async Task<IActionResult> SendEmailToRequestAdminAcces([FromBody] CreateEmailDto req)
    {
        EmailMessage email = new()
        {
            From = req.Email,
            To = "kerimugurlu24@gmail.com",
            Subject = $"{req.FirstName} {req.LastName} is requesting to become an admin",
        };

        return Ok();
    }

    [HttpPost("users")]
    public async Task<IActionResult> CreatePendingUser([FromBody] CreatePendingUserDto req)
    {
        return Ok();
    }
}
