using FluentValidation;
using System.Globalization;
using Models;

namespace Dtos;

public class EnrolmentFormRequestDto
{
    public required string FirstName { get; set; }
    public string? MiddleName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required int Age { get; set; }
    public required string Gender { get; set; }
    public required string CountryOfBirth { get; set; }
    public required string CountryOfCitizenship { get; set; }
    public required List<EnrolmentFormSiblingRequestDto>? Siblings { get; set; }
    public required string FilePath { get; set; }
}

public class EnrolmentFormSiblingRequestDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}

public class EnrolmentFormRequestDtoValidator : AbstractValidator<EnrolmentFormRequestDto>
{
    public EnrolmentFormRequestDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotNull().WithMessage("First name not provided")
            .NotEmpty().WithMessage("First name cannot be empty")
            .MaximumLength(128).WithMessage("First name cannot exceed 128 characters")
            .Must(name => name.All(char.IsLetter)).WithMessage("First name should consist of letters");

        RuleFor(x => x.MiddleName)
            .NotEmpty().WithMessage("Middle name cannot be empty")
            .MaximumLength(128).WithMessage("Middle name cannot exceed 128 characters")
            .Must(name => name.All(char.IsLetter)).WithMessage("Middle name should consist of letters")
            .When(x => x.MiddleName != null);

        RuleFor(x => x.LastName)
            .NotNull().WithMessage("Last name not provided")
            .NotEmpty().WithMessage("Last name cannot be empty")
            .MaximumLength(128).WithMessage("Last name cannot exceed 128 characters")
            .Must(name => name.All(char.IsLetter)).WithMessage("Last name should consist of letters");

        RuleFor(x => x.Email)
            .NotNull().WithMessage("Email not provided")
            .NotEmpty().WithMessage("Email cannot be empty")
            .MaximumLength(128).WithMessage("Email cannot exceed 128 characters")
            .EmailAddress().WithMessage("Invalid email address");

        RuleFor(x => x.DateOfBirth)
            .NotNull().WithMessage("Date of birth not provided")
                .WithMessage("Date of birth must be a valid date between 1900 and today.")
            .Must(date => date <= DateTime.UtcNow)
                .WithMessage("Date of birth must be a valid date between 1900 and today.");

        RuleFor(x => x.Age)
            .NotNull().WithMessage("Age not provided");

        RuleFor(x => x.Gender)
            .Must(gender => gender == "male" || gender == "female").WithMessage("Unknown gender");

        RuleFor(x => x.CountryOfBirth)
            .NotNull().WithMessage("Country of birth not provided")
            .NotEmpty().WithMessage("Country of birth cannot be empty")
            .MaximumLength(2).WithMessage("Invalid country code");

        RuleFor(x => x.CountryOfCitizenship)
            .NotNull().WithMessage("Country of citizenship not provided")
            .NotEmpty().WithMessage("Country of citizenship cannot be empty")
            .MaximumLength(2).WithMessage("Invalid country code");

        RuleForEach(x => x.Siblings).ChildRules(sibling =>
        {
            sibling.RuleFor(s => s.FirstName)
                .NotEmpty().WithMessage("Sibling first name cannot be empty")
                .Must(name => name.All(char.IsLetter)).WithMessage("Sibling first name should consist of letters");

            sibling.RuleFor(s => s.LastName)
                .NotEmpty().WithMessage("Sibling last name cannot be empty")
                .Must(name => name.All(char.IsLetter)).WithMessage("Sibling last name should consist of letters");
        });
    }
}
