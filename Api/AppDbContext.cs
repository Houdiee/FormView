using Microsoft.EntityFrameworkCore;
using Models;

public class AppDbContext(IConfiguration configuration) : DbContext
{
    private readonly IConfiguration _configuration = configuration;

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<EnrolmentForm> EnrolmentForms { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasKey(u => u.Id);

        modelBuilder.Entity<EnrolmentForm>().HasKey(f => f.Id);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_configuration.GetConnectionString("Database")!);
    }
}
