using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using GazAvtoMaster.API.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CarsController(IHubContext<NotificationHub> hub) : ControllerBase
{
    private static CarDto Map(GazAvtoMaster.API.Models.Car c)
    {
        var model = MockData.Models.FirstOrDefault(m => m.ModelId == c.ModelId);
        var brand = model != null ? MockData.Brands.FirstOrDefault(b => b.BrandId == model.BrandId) : null;
        var status = MockData.Statuses.FirstOrDefault(s => s.StatusId == c.StatusId);
        return new CarDto(c.CarId, c.Vin, c.ModelId,
            model?.ModelName ?? "", brand?.BrandName ?? "",
            c.Year, c.Color, c.Mileage, c.Price,
            c.StatusId, status?.StatusName ?? "", c.ArrivalDate, c.Notes);
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(MockData.Cars.Select(Map));

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var car = MockData.Cars.FirstOrDefault(c => c.CarId == id);
        return car == null ? NotFound() : Ok(Map(car));
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateRequest req)
    {
        var car = MockData.Cars.FirstOrDefault(c => c.CarId == id);
        if (car == null) return NotFound();
        car.StatusId = req.StatusId;
        var status = MockData.Statuses.FirstOrDefault(s => s.StatusId == req.StatusId);
        await hub.Clients.All.SendAsync("ReceiveNotification",
            $"Статус авто #{id} изменён на «{status?.StatusName}»");
        return Ok(Map(car));
    }
}

public record StatusUpdateRequest(int StatusId);
