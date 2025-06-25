using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Resend;
using Dtos;
using Models;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController(
    AppDbContext context,
    IPasswordHasher<UserModel> passwordHasher,
    TokenProvider tokenProvider
) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly IPasswordHasher<UserModel> _passwordHasher = passwordHasher;
    private readonly TokenProvider _tokenProvier = tokenProvider;

    [HttpPost]
    public async Task<IActionResult> VerifyUserCredentials([FromBody] LoginRequestDto req)
    {
        UserModel? user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null)
        {
            return BadRequest(new { error = $"User with email {req.Email} not found" });
        }

        PasswordVerificationResult result = _passwordHasher
            .VerifyHashedPassword(user, user.HashedPassword, req.Password);

        if (result == PasswordVerificationResult.Failed)
        {
            return BadRequest(new { error = "Incorrect password" });
        }

        return Ok(new { token = _tokenProvier.Create(user) });
    }
}
