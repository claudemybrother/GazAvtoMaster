using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using GazAvtoMaster.API.Hubs;
using GazAvtoMaster.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CarsController(AppDbContext db, IHubContext<NotificationHub> hub) : ControllerBase
{
    private static CarDto Map(Car c) =>
        new(c.CarId, c.Vin, c.ModelId,
            c.Model?.ModelName ?? "", c.Model?.Brand?.BrandName ?? "",
            c.Year, c.Color, c.Mileage, c.Price,
            c.StatusId, c.Status?.StatusName ?? "", c.ArrivalDate, c.Notes);

    private IQueryable<Car> WithIncludes() =>
        db.Cars.Include(c => c.Model).ThenInclude(m => m.Brand).Include(c => c.Status);

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok((await WithIncludes().ToListAsync()).Select(Map));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var car = await WithIncludes().FirstOrDefaultAsync(c => c.CarId == id);
        return car == null ? NotFound() : Ok(Map(car));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CarRequest req)
    {
        var car = new Car
        {
            Vin = req.Vin, ModelId = req.ModelId, Year = req.Year, Color = req.Color,
            Mileage = req.Mileage, Price = req.Price, StatusId = req.StatusId,
            ArrivalDate = DateTime.SpecifyKind(req.ArrivalDate, DateTimeKind.Utc),
            Notes = req.Notes
        };
        db.Cars.Add(car);
        await db.SaveChangesAsync();
        var created = await WithIncludes().FirstAsync(c => c.CarId == car.CarId);
        return Ok(Map(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CarRequest req)
    {
        var car = await db.Cars.FindAsync(id);
        if (car == null) return NotFound();
        car.Vin = req.Vin; car.ModelId = req.ModelId; car.Year = req.Year;
        car.Color = req.Color; car.Mileage = req.Mileage; car.Price = req.Price;
        car.StatusId = req.StatusId;
        car.ArrivalDate = DateTime.SpecifyKind(req.ArrivalDate, DateTimeKind.Utc);
        car.Notes = req.Notes;
        await db.SaveChangesAsync();
        var updated = await WithIncludes().FirstAsync(c => c.CarId == id);
        return Ok(Map(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var car = await db.Cars.FindAsync(id);
        if (car == null) return NotFound();
        db.Cars.Remove(car);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateRequest req)
    {
        var car = await WithIncludes().FirstOrDefaultAsync(c => c.CarId == id);
        if (car == null) return NotFound();
        car.StatusId = req.StatusId;
        await db.SaveChangesAsync();
        var status = await db.Statuses.FindAsync(req.StatusId);
        await hub.Clients.All.SendAsync("ReceiveNotification",
            $"Статус авто #{id} изменён на «{status?.StatusName}»");
        return Ok(Map(car));
    }
}

public record StatusUpdateRequest(int StatusId);
