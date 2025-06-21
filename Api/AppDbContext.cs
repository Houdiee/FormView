using Microsoft.EntityFrameworkCore;

public class AppDbContext(IConfiguration configuration) : DbContext
{
    private readonly IConfiguration _configuration = configuration;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_configuration.GetConnectionString("Database")!);
    }
}
