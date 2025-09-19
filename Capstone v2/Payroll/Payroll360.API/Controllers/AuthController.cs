using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Payroll360.Core.DTOs;
using Payroll360.Core.Entities;
using Payroll360.Core.Enums;
using Payroll360.Infrastructure.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Payroll360.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "auth")]
    public class AuthController : ControllerBase
    {
        private readonly Payroll360Context _context;
        private readonly IConfiguration _config;
        private readonly PasswordHasher<Employee> _passwordHasher;

        public AuthController(Payroll360Context context, IConfiguration config)
        {
            _context = context;
            _config = config;
            _passwordHasher = new PasswordHasher<Employee>();
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequest)
        {
            if (registerRequest == null
                || string.IsNullOrWhiteSpace(registerRequest.Email)
                || string.IsNullOrWhiteSpace(registerRequest.Password)
                || string.IsNullOrWhiteSpace(registerRequest.Role))
            {
                return BadRequest(new { message = "Invalid input" });
            }

            if (registerRequest.Password != registerRequest.ConfirmPassword)
                return BadRequest(new { message = "Passwords do not match" });

            try
            {
                var existingUser = await _context.Employees
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == registerRequest.Email.ToLower());

                if (existingUser != null)
                    return BadRequest(new { message = "Email already exists" });

                if (!Enum.TryParse<EmployeeRole>(registerRequest.Role, true, out var parsedRole))
                    return BadRequest(new { message = "Invalid role provided" });

                var employee = new Employee
                {
                    FullName = $"{registerRequest.FirstName} {registerRequest.LastName}",
                    Email = registerRequest.Email,
                    Department = registerRequest.Department,
                    Role = parsedRole
                };

                employee.PasswordHash = _passwordHasher.HashPassword(employee, registerRequest.Password);

                await _context.Employees.AddAsync(employee);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User registered successfully" });
            }
            catch (Exception)
            {
                return StatusCode(503, new { message = "Database connection unavailable. Please contact administrator." });
            }
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequest)
        {
            if (loginRequest == null
                || string.IsNullOrWhiteSpace(loginRequest.Email)
                || string.IsNullOrWhiteSpace(loginRequest.Password))
                return BadRequest(new { message = "Invalid input" });

            // Hardcoded demo users
            if (loginRequest.Email.ToLower() == "admin@payroll360.com" && loginRequest.Password == "Admin@123")
            {
                var adminUser = new Employee
                {
                    Id = 1,
                    FullName = "System Administrator",
                    Email = "admin@payroll360.com",
                    Department = "IT",
                    Role = EmployeeRole.Admin
                };

                var token = GenerateJwtToken(adminUser);
                return Ok(new AuthResponseDTO
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"]))
                });
            }
            
            if (loginRequest.Email.ToLower() == "john.doe@company.com" && loginRequest.Password == "password")
            {
                var employeeUser = new Employee
                {
                    Id = 2,
                    FullName = "John Doe",
                    Email = "john.doe@company.com",
                    Department = "IT",
                    Role = EmployeeRole.Employee
                };

                var token = GenerateJwtToken(employeeUser);
                return Ok(new AuthResponseDTO
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"]))
                });
            }
            
            if (loginRequest.Email.ToLower() == "jane.manager@company.com" && loginRequest.Password == "password")
            {
                var managerUser = new Employee
                {
                    Id = 3,
                    FullName = "Jane Manager",
                    Email = "jane.manager@company.com",
                    Department = "IT",
                    Role = EmployeeRole.Manager
                };

                var token = GenerateJwtToken(managerUser);
                return Ok(new AuthResponseDTO
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"]))
                });
            }
            
            if (loginRequest.Email.ToLower() == "bob.finance@company.com" && loginRequest.Password == "password")
            {
                var financeUser = new Employee
                {
                    Id = 4,
                    FullName = "Bob Finance",
                    Email = "bob.finance@company.com",
                    Department = "Finance",
                    Role = EmployeeRole.FinanceAdmin
                };

                var token = GenerateJwtToken(financeUser);
                return Ok(new AuthResponseDTO
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"]))
                });
            }

            try
            {
                var user = await _context.Employees
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == loginRequest.Email.ToLower());

                if (user == null)
                    return Unauthorized(new { message = "Invalid email or password" });

                var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, loginRequest.Password);
                if (result == PasswordVerificationResult.Failed)
                    return Unauthorized(new { message = "Invalid email or password" });

                var userToken = GenerateJwtToken(user);

                return Ok(new AuthResponseDTO
                {
                    Token = userToken,
                    Expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"]))
                });
            }
            catch (Exception)
            {
                return StatusCode(503, new { message = "Database connection unavailable. Please contact administrator." });
            }
        }

        // ================= JWT GENERATION =================
        private string GenerateJwtToken(Employee user)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT Key is missing"));
            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                // keep sub = email for traceability
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

                // ✅ critical: employeeId stored as NameIdentifier
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),

                new Claim(ClaimTypes.Name, user.FullName ?? string.Empty),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            // add Department claim only if not null
            if (!string.IsNullOrEmpty(user.Department))
            {
                claims.Add(new Claim("Department", user.Department));
            }

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
