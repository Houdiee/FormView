using Resend;
using Microsoft.AspNetCore.Identity;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Password Hasher
builder.Services.AddScoped<IPasswordHasher<Models.UserModel>, PasswordHasher<Models.UserModel>>();

// EF Core setup
using (var context = new AppDbContext(builder.Configuration))
{
    context.Database.EnsureCreated();
}
builder.Services.AddDbContext<AppDbContext>();


// CORS setup
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins(builder.Configuration.GetConnectionString("Frontend")!);
    });
});

// FluentValidation setup
builder.Services.AddFluentValidationAutoValidation()
                .AddFluentValidationClientsideAdapters()
                .AddValidatorsFromAssemblyContaining<Program>();

// Resend setup
builder.Services.AddOptions();
builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(o =>
{
    o.ApiToken = builder.Configuration["ResendApiKey"]!;
});
builder.Services.AddTransient<IResend, ResendClient>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
