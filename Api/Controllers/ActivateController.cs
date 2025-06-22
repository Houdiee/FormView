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
        User? user = await _context.Users.FirstOrDefaultAsync(u => u.ActivationToken == token);
        if (user == null)
        {
            return BadRequest(new { error = "User not found" });
        }

        user.Status = Status.Accepted;
        user.ActivationToken = null;

        _context.Users.Update(user);

        try
        {
            await _context.SaveChangesAsync();
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
