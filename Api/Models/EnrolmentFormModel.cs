using System.Text.Json.Serialization;
using FluentValidation;
using System.Text.RegularExpressions;
using Dtos;

namespace Models;

public class EnrolmentForm
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string MiddleName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required int Age { get; set; }
    public required string Gender { get; set; }
    public required string CountryOfBirth { get; set; }
    public required string CountryOfCitizenship { get; set; }
    public required List<EnrolmentFormSibling> Siblings { get; set; } = new();
    public required DateTime CreatedAt { get; set; }
    public required string FilePath { get; set; }
}

public class EnrolmentFormSibling
{
    [JsonIgnore]
    public int Id { get; set; }

    public required string FirstName { get; set; }
    public required string LastName { get; set; }

    [JsonIgnore]
    public int EnrolmentFormId { get; set; }

    [JsonIgnore]
    public EnrolmentForm EnrolmentForm { get; set; } = null!;
}
