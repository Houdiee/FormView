using Microsoft.AspNetCore.Mvc;
using Resend;
using Dtos;

namespace Api.Controllers;

[ApiController]
[Route("api/pending/[controller]")]
public class SignupController(IConfiguration configuration, IResend resend) : ControllerBase
{
    private readonly IConfiguration _configuration = configuration;
    private readonly IResend _resend = resend;

    [HttpPost]
    public async Task<IActionResult> SignupAndRequestAdminAccess([FromBody] SignupRequestDto req)
    {
        string grantAccessLink = "TODO";

        EmailMessage email = new()
        {
            From = "onboarding@resend.dev",
            To = _configuration["OwnerEmail"]!,
            Subject = $"{req.FirstName} {req.LastName} is requesting admin access",
            HtmlBody = $"<p>Click <a href={grantAccessLink}>here</a> to grant {req.Email} admin access.</p>",
        };
        await _resend.EmailSendAsync(email);

        return Ok(email);
    }
}
