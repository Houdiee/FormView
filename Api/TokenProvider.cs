using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Models;

public class TokenProvider(IConfiguration configuration)
{
    private readonly IConfiguration _configuration = configuration;

    public string Create(UserModel user)
    {
        JwtSecurityTokenHandler tokenHandler = new();
        byte[] key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);

        List<Claim> claims = [
          new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        ];

        SecurityTokenDescriptor tokenDesciptor = new()
        {
            Issuer = _configuration["Jwt:Issuer"],

            Audience = _configuration["Jwt:Audience"],

            Subject = new ClaimsIdentity(claims),

            Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiresInMins"]!)),

            SigningCredentials = new SigningCredentials(
                key: new SymmetricSecurityKey(key),
                algorithm: SecurityAlgorithms.HmacSha256Signature
            )
        };

        SecurityToken token = tokenHandler.CreateToken(tokenDesciptor);
        return tokenHandler.WriteToken(token);
    }
}
