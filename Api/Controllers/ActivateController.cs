using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivateController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    [HttpGet("{token}")]
    public async Task<IActionResult> ActivateAccountToAdmin(Guid token)
    {
        User? existingUser = await _context.Users.FirstOrDefaultAsync(u => u.ActivationToken == token);
        if (existingUser == null)
        {
            return BadRequest(new { error = "User not found" });
        }

        existingUser.Status = Status.Accepted;
        existingUser.ActivationToken = null;

        _context.Users.Update(existingUser);

        return Ok(new { message = "User account activated successfully with admin access" });
    }
}
