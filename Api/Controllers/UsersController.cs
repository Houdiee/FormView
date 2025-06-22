using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Models;
using Dtos;

[ApiController]
[Route("api/[controller]")]
public class UsersController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserById(int userId)
    {
        User? user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return BadRequest(new { error = "User does not exist" });
        }

        return Ok(new UserResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Status = Status.Pending,
        });
    }


    [HttpGet]
    public async Task<IActionResult> QueryUserByEmail(string email)
    {
        User? user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            return BadRequest(new { error = "User does not exist" });
        }

        return Ok(new UserResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Status = Status.Pending,
        });
    }
}
