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
    public required List<string[]> Siblings { get; set; }
    public required DateTime CreatedAt { get; set; }
}
