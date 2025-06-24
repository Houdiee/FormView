using FluentValidation;

namespace Dtos;

public class SignupRequestDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string ConfirmPassword { get; set; }
}

public class SignupRequestDtoValidator : AbstractValidator<SignupRequestDto>
{
    public SignupRequestDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotNull().WithMessage("First name not provided")
            .NotEmpty().WithMessage("First name cannot be empty")
            .MaximumLength(128).WithMessage("First name cannot exceed 128 characters");

        RuleFor(x => x.LastName)
            .NotNull().WithMessage("Last name not provided")
            .NotEmpty().WithMessage("Last name cannot be empty")
            .MaximumLength(128).WithMessage("Last name cannot exceed 128 characters");

        RuleFor(x => x.Email)
            .NotNull().WithMessage("Email not provided")
            .NotEmpty().WithMessage("Email cannot be empty")
            .MaximumLength(128).WithMessage("Email cannot exceed 128 characters")
            .EmailAddress().WithMessage("Invalid email");

        RuleFor(x => x.Password)
            .NotNull().WithMessage("Password not provided")
            .NotEmpty().WithMessage("Password cannot be empty")
            .MaximumLength(128).WithMessage("Password cannot exceed 128 characters");

        RuleFor(x => x.ConfirmPassword)
            .NotNull().WithMessage("Password not provided")
            .NotEmpty().WithMessage("Password cannot be empty")
            .MaximumLength(128).WithMessage("Password cannot exceed 128 characters")
            .Equal(x => x.Password).WithMessage("Passwords do not match");
    }
}
