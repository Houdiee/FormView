using Microsoft.EntityFrameworkCore;
using Models;

public class AppDbContext(IConfiguration configuration) : DbContext
{
    private readonly IConfiguration _configuration = configuration;

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<EnrolmentForm> EnrolmentForms { get; set; } = null!;
    public DbSet<EnrolmentFormSibling> EnrolmentFormSiblings { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasKey(u => u.Id);

        modelBuilder.Entity<EnrolmentForm>().HasKey(f => f.Id);

        modelBuilder.Entity<EnrolmentFormSibling>().HasKey(s => s.Id);

        modelBuilder.Entity<EnrolmentForm>()
            .HasMany(f => f.Siblings)
            .WithOne(s => s.EnrolmentForm)
            .HasForeignKey(s => s.EnrolmentFormId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_configuration.GetConnectionString("Database")!);
    }
}
