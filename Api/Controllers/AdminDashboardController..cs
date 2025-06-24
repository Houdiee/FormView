using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Dtos;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/[controller]")]
public class DashboardController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    [HttpGet]
    public async Task<IActionResult> GetSubmissionCountsForAllForms()
    {
        var formsData = new List<DashboardFormItemDto>()
        {
            new DashboardFormItemDto {
                FormName = "Enrolment form",
                FormSubmissionCount = await _context.EnrolmentForms.CountAsync(),
                FormUrlPath = "/admin/forms/enrolments",
            },
        };

        return Ok(formsData);
    }
}
