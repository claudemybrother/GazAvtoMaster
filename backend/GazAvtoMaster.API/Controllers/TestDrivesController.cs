using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TestDrivesController : ControllerBase
{
    private static TestDriveDto Map(GazAvtoMaster.API.Models.TestDrive t)
    {
        var car = MockData.Cars.FirstOrDefault(c => c.CarId == t.CarId);
        var model = car != null ? MockData.Models.FirstOrDefault(m => m.ModelId == car.ModelId) : null;
        var brand = model != null ? MockData.Brands.FirstOrDefault(b => b.BrandId == model.BrandId) : null;
        var client = MockData.Clients.FirstOrDefault(c => c.ClientId == t.ClientId);
        var emp = MockData.Employees.FirstOrDefault(e => e.EmployeeId == t.EmployeeId);
        return new TestDriveDto(t.TdId, t.CarId,
            $"{brand?.BrandName} {model?.ModelName} ({car?.Year})",
            t.ClientId, $"{client?.LastName} {client?.FirstName}",
            t.EmployeeId, $"{emp?.LastName} {emp?.FirstName}",
            t.TdDate, t.Feedback);
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(MockData.TestDrives.Select(Map));
}
