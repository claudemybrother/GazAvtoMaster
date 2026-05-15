using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using GazAvtoMaster.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController(AppDbContext db) : ControllerBase
{
    private static EmployeeDto Map(Employee e) =>
        new(e.EmployeeId, e.LastName, e.FirstName, e.Patronymic,
            e.RoleId, e.Role?.RoleName ?? "", e.Phone, e.Email, e.HireDate, e.Login);

    [HttpGet]
    [Authorize(Roles = "Администратор")]
    public async Task<IActionResult> GetAll() =>
        Ok((await db.Employees.Include(e => e.Role).ToListAsync()).Select(Map));

    [HttpGet("{id}")]
    [Authorize(Roles = "Администратор")]
    public async Task<IActionResult> Get(int id)
    {
        var e = await db.Employees.Include(e => e.Role).FirstOrDefaultAsync(e => e.EmployeeId == id);
        return e == null ? NotFound() : Ok(Map(e));
    }

    [HttpPost]
    [Authorize(Roles = "Администратор")]
    public async Task<IActionResult> Create([FromBody] EmployeeRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Пароль обязателен" });
        var e = new Employee
        {
            LastName = req.LastName, FirstName = req.FirstName, Patronymic = req.Patronymic,
            RoleId = req.RoleId, Phone = req.Phone, Email = req.Email,
            HireDate = DateTime.SpecifyKind(req.HireDate, DateTimeKind.Utc),
            Login = req.Login, Password = BCrypt.Net.BCrypt.HashPassword(req.Password)
        };
        db.Employees.Add(e);
        await db.SaveChangesAsync();
        var created = await db.Employees.Include(x => x.Role).FirstAsync(x => x.EmployeeId == e.EmployeeId);
        return Ok(Map(created));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Администратор")]
    public async Task<IActionResult> Update(int id, [FromBody] EmployeeRequest req)
    {
        var e = await db.Employees.FindAsync(id);
        if (e == null) return NotFound();
        e.LastName = req.LastName; e.FirstName = req.FirstName; e.Patronymic = req.Patronymic;
        e.RoleId = req.RoleId; e.Phone = req.Phone; e.Email = req.Email;
        e.HireDate = DateTime.SpecifyKind(req.HireDate, DateTimeKind.Utc);
        e.Login = req.Login;
        if (!string.IsNullOrWhiteSpace(req.Password))
            e.Password = BCrypt.Net.BCrypt.HashPassword(req.Password);
        await db.SaveChangesAsync();
        var updated = await db.Employees.Include(x => x.Role).FirstAsync(x => x.EmployeeId == id);
        return Ok(Map(updated));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Администратор")]
    public async Task<IActionResult> Delete(int id)
    {
        var e = await db.Employees.FindAsync(id);
        if (e == null) return NotFound();
        db.Employees.Remove(e);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
