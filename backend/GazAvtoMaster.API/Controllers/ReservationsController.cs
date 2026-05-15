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
public class ReservationsController(AppDbContext db) : ControllerBase
{
    private static ReservationDto Map(Reservation r) =>
        new(r.ReservationId, r.CarId,
            $"{r.Car?.Model?.Brand?.BrandName} {r.Car?.Model?.ModelName} ({r.Car?.Year})",
            r.ClientId, $"{r.Client?.LastName} {r.Client?.FirstName}",
            r.EmployeeId, $"{r.Employee?.LastName} {r.Employee?.FirstName}",
            r.ReservationDate, r.ExpiryDate, r.Deposit);

    private IQueryable<Reservation> WithIncludes() =>
        db.Reservations
            .Include(r => r.Car).ThenInclude(c => c.Model).ThenInclude(m => m.Brand)
            .Include(r => r.Client)
            .Include(r => r.Employee);

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok((await WithIncludes().ToListAsync()).Select(Map));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ReservationRequest req)
    {
        var r = new Reservation
        {
            CarId = req.CarId, ClientId = req.ClientId, EmployeeId = req.EmployeeId,
            ReservationDate = DateTime.SpecifyKind(req.ReservationDate, DateTimeKind.Utc),
            ExpiryDate = DateTime.SpecifyKind(req.ExpiryDate, DateTimeKind.Utc),
            Deposit = req.Deposit
        };
        db.Reservations.Add(r);
        await db.SaveChangesAsync();
        var created = await WithIncludes().FirstAsync(x => x.ReservationId == r.ReservationId);
        return Ok(Map(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ReservationRequest req)
    {
        var r = await db.Reservations.FindAsync(id);
        if (r == null) return NotFound();
        r.CarId = req.CarId; r.ClientId = req.ClientId; r.EmployeeId = req.EmployeeId;
        r.ReservationDate = DateTime.SpecifyKind(req.ReservationDate, DateTimeKind.Utc);
        r.ExpiryDate = DateTime.SpecifyKind(req.ExpiryDate, DateTimeKind.Utc);
        r.Deposit = req.Deposit;
        await db.SaveChangesAsync();
        var updated = await WithIncludes().FirstAsync(x => x.ReservationId == id);
        return Ok(Map(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var r = await db.Reservations.FindAsync(id);
        if (r == null) return NotFound();
        db.Reservations.Remove(r);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
