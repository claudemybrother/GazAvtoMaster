using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DealsController : ControllerBase
{
    private static DealDto Map(GazAvtoMaster.API.Models.Deal d)
    {
        var car = MockData.Cars.FirstOrDefault(c => c.CarId == d.CarId);
        var model = car != null ? MockData.Models.FirstOrDefault(m => m.ModelId == car.ModelId) : null;
        var brand = model != null ? MockData.Brands.FirstOrDefault(b => b.BrandId == model.BrandId) : null;
        var client = MockData.Clients.FirstOrDefault(c => c.ClientId == d.ClientId);
        var emp = MockData.Employees.FirstOrDefault(e => e.EmployeeId == d.EmployeeId);
        return new DealDto(d.DealId, d.CarId,
            $"{brand?.BrandName} {model?.ModelName} ({car?.Year})",
            d.ClientId, $"{client?.LastName} {client?.FirstName}",
            d.EmployeeId, $"{emp?.LastName} {emp?.FirstName}",
            d.DealDate, d.FinalPrice, d.PaymentType, d.Notes);
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(MockData.Deals.Select(Map));

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var d = MockData.Deals.FirstOrDefault(x => x.DealId == id);
        return d == null ? NotFound() : Ok(Map(d));
    }
}
