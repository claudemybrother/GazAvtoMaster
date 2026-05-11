using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using GazAvtoMaster.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(JwtService jwt) : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        var emp = MockData.Employees.FirstOrDefault(e => e.Login == req.Login);
        if (emp == null || !BCrypt.Net.BCrypt.Verify(req.Password, emp.Password))
            return Unauthorized(new { message = "Неверный логин или пароль" });

        var role = MockData.Roles.First(r => r.RoleId == emp.RoleId);
        var token = jwt.Generate(emp.EmployeeId, emp.Login, role.RoleName);
        return Ok(new LoginResponse(
            token,
            $"{emp.LastName} {emp.FirstName} {emp.Patronymic}",
            role.RoleName,
            emp.EmployeeId
        ));
    }
}
