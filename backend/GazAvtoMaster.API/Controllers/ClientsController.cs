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
public class ClientsController(AppDbContext db) : ControllerBase
{
    private static ClientDto Map(Client c) =>
        new(c.ClientId, c.LastName, c.FirstName, c.Patronymic,
            c.Phone, c.Email, c.PassportSeries, c.PassportNumber,
            c.BirthDate, c.Address);

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok((await db.Clients.ToListAsync()).Select(Map));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var c = await db.Clients.FindAsync(id);
        return c == null ? NotFound() : Ok(Map(c));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ClientRequest req)
    {
        var c = new Client
        {
            LastName = req.LastName, FirstName = req.FirstName, Patronymic = req.Patronymic,
            Phone = req.Phone, Email = req.Email,
            PassportSeries = req.PassportSeries, PassportNumber = req.PassportNumber,
            BirthDate = DateTime.SpecifyKind(req.BirthDate, DateTimeKind.Utc),
            Address = req.Address
        };
        db.Clients.Add(c);
        await db.SaveChangesAsync();
        return Ok(Map(c));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ClientRequest req)
    {
        var c = await db.Clients.FindAsync(id);
        if (c == null) return NotFound();
        c.LastName = req.LastName; c.FirstName = req.FirstName; c.Patronymic = req.Patronymic;
        c.Phone = req.Phone; c.Email = req.Email;
        c.PassportSeries = req.PassportSeries; c.PassportNumber = req.PassportNumber;
        c.BirthDate = DateTime.SpecifyKind(req.BirthDate, DateTimeKind.Utc);
        c.Address = req.Address;
        await db.SaveChangesAsync();
        return Ok(Map(c));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await db.Clients.FindAsync(id);
        if (c == null) return NotFound();
        db.Clients.Remove(c);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}/details")]
    public async Task<IActionResult> GetDetails(int id)
    {
        var c = await db.Clients.FindAsync(id);
        if (c == null) return NotFound();

        var deals = await db.Deals
            .Include(d => d.Car).ThenInclude(x => x.Model).ThenInclude(x => x.Brand)
            .Include(d => d.Client)
            .Include(d => d.Employee)
            .Where(d => d.ClientId == id)
            .ToListAsync();

        var reservations = await db.Reservations
            .Include(r => r.Car).ThenInclude(x => x.Model).ThenInclude(x => x.Brand)
            .Include(r => r.Client)
            .Include(r => r.Employee)
            .Where(r => r.ClientId == id)
            .ToListAsync();

        var testDrives = await db.TestDrives
            .Include(t => t.Car).ThenInclude(x => x.Model).ThenInclude(x => x.Brand)
            .Include(t => t.Client)
            .Include(t => t.Employee)
            .Where(t => t.ClientId == id)
            .ToListAsync();

        var dto = new ClientDetailsDto(
            Map(c),
            deals.Select(d => new DealDto(d.DealId, d.CarId,
                $"{d.Car?.Model?.Brand?.BrandName} {d.Car?.Model?.ModelName} ({d.Car?.Year})",
                d.ClientId, $"{d.Client?.LastName} {d.Client?.FirstName}",
                d.EmployeeId, $"{d.Employee?.LastName} {d.Employee?.FirstName}",
                d.DealDate, d.FinalPrice, d.PaymentType, d.Notes)),
            reservations.Select(r => new ReservationDto(r.ReservationId, r.CarId,
                $"{r.Car?.Model?.Brand?.BrandName} {r.Car?.Model?.ModelName} ({r.Car?.Year})",
                r.ClientId, $"{r.Client?.LastName} {r.Client?.FirstName}",
                r.EmployeeId, $"{r.Employee?.LastName} {r.Employee?.FirstName}",
                r.ReservationDate, r.ExpiryDate, r.Deposit)),
            testDrives.Select(t => new TestDriveDto(t.TdId, t.CarId,
                $"{t.Car?.Model?.Brand?.BrandName} {t.Car?.Model?.ModelName} ({t.Car?.Year})",
                t.ClientId, $"{t.Client?.LastName} {t.Client?.FirstName}",
                t.EmployeeId, $"{t.Employee?.LastName} {t.Employee?.FirstName}",
                t.TdDate, t.Feedback))
        );

        return Ok(dto);
    }
}
