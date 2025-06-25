namespace Models;

public enum Status
{
    Pending,
    Accepted,
}

public class UserModel
{
    public int Id { get; set; }

    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }

    public required Status Status { get; set; }
    public Guid? ActivationToken { get; set; }

    public string HashedPassword { get; set; } = null!;
}
