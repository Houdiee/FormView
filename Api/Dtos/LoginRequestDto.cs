using FluentValidation;

namespace Dtos;

public class LoginRequestDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class LoginRequestDtoValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotNull().WithMessage("Email not provided")
            .NotEmpty().WithMessage("Email cannot be empty")
            .MaximumLength(128).WithMessage("Email cannot exceed 128 characters")
            .EmailAddress().WithMessage("Invalid email");

        RuleFor(x => x.Password)
            .NotNull().WithMessage("Password not provided")
            .NotEmpty().WithMessage("Password cannot be empty")
            .MaximumLength(128).WithMessage("Password cannot exceed 128 characters");
    }
}
