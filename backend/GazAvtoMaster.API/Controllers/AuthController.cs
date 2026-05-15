using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using GazAvtoMaster.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(JwtService jwt, AppDbContext db) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var emp = await db.Employees.Include(e => e.Role)
            .FirstOrDefaultAsync(e => e.Login == req.Login);

        if (emp == null || !BCrypt.Net.BCrypt.Verify(req.Password, emp.Password))
            return Unauthorized(new { message = "Неверный логин или пароль" });

        var fullName = $"{emp.LastName} {emp.FirstName} {emp.Patronymic}";
        var token = jwt.Generate(emp.EmployeeId, emp.Login, emp.Role.RoleName, fullName);
        return Ok(new LoginResponse(token, fullName, emp.Role.RoleName, emp.EmployeeId));
    }
}
