using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReservationsController : ControllerBase
{
    private static ReservationDto Map(GazAvtoMaster.API.Models.Reservation r)
    {
        var car = MockData.Cars.FirstOrDefault(c => c.CarId == r.CarId);
        var model = car != null ? MockData.Models.FirstOrDefault(m => m.ModelId == car.ModelId) : null;
        var brand = model != null ? MockData.Brands.FirstOrDefault(b => b.BrandId == model.BrandId) : null;
        var client = MockData.Clients.FirstOrDefault(c => c.ClientId == r.ClientId);
        var emp = MockData.Employees.FirstOrDefault(e => e.EmployeeId == r.EmployeeId);
        return new ReservationDto(r.ReservationId, r.CarId,
            $"{brand?.BrandName} {model?.ModelName} ({car?.Year})",
            r.ClientId, $"{client?.LastName} {client?.FirstName}",
            r.EmployeeId, $"{emp?.LastName} {emp?.FirstName}",
            r.ReservationDate, r.ExpiryDate, r.Deposit);
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(MockData.Reservations.Select(Map));
}
