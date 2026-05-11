using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private static EmployeeDto Map(GazAvtoMaster.API.Models.Employee e)
    {
        var role = MockData.Roles.FirstOrDefault(r => r.RoleId == e.RoleId);
        return new EmployeeDto(e.EmployeeId, e.LastName, e.FirstName, e.Patronymic,
            e.RoleId, role?.RoleName ?? "", e.Phone, e.Email, e.HireDate, e.Login);
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(MockData.Employees.Select(Map));

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var e = MockData.Employees.FirstOrDefault(x => x.EmployeeId == id);
        return e == null ? NotFound() : Ok(Map(e));
    }
}
