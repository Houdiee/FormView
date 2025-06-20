using FluentValidation;

namespace Dtos;

public class CreateEmailDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
}

public class CreateEmailDtoValidator : AbstractValidator<CreateEmailDto>
{
    public CreateEmailDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name not provided")
            .MaximumLength(128).WithMessage("First name cannot exceed 128 characters");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name not provided")
            .MaximumLength(128).WithMessage("Last name cannot exceed 128 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email not provided")
            .MaximumLength(128).WithMessage("Email cannot exceed 128 characters")
            .EmailAddress().WithMessage("Invalid email");
    }
}
