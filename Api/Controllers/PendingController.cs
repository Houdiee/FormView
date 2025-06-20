using Microsoft.AspNetCore.Mvc;
using Resend;
using Dtos;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class PendingController(IResend resend) : ControllerBase
{
    private readonly IResend _resend = resend;

    [HttpPost("email")]
    public async Task<IActionResult> SendEmailToRequestAdminAcces([FromBody] CreateEmailDto createEmailDto)
    {
        await Task.Delay(1);
        return Ok("");
    }
}
