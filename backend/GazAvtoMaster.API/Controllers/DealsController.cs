using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using GazAvtoMaster.API.Models;
using GazAvtoMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DealsController(AppDbContext db, AuditService audit) : ControllerBase
{
    private static DealDto Map(Deal d) =>
        new(d.DealId, d.CarId,
            $"{d.Car?.Model?.Brand?.BrandName} {d.Car?.Model?.ModelName} ({d.Car?.Year})",
            d.ClientId, $"{d.Client?.LastName} {d.Client?.FirstName}",
            d.EmployeeId, $"{d.Employee?.LastName} {d.Employee?.FirstName}",
            d.DealDate, d.FinalPrice, d.PaymentType, d.Notes);

    private IQueryable<Deal> WithIncludes() =>
        db.Deals
            .Include(d => d.Car).ThenInclude(c => c.Model).ThenInclude(m => m.Brand)
            .Include(d => d.Client)
            .Include(d => d.Employee);

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok((await WithIncludes().ToListAsync()).Select(Map));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var d = await WithIncludes().FirstOrDefaultAsync(x => x.DealId == id);
        return d == null ? NotFound() : Ok(Map(d));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DealRequest req)
    {
        var deal = new Deal
        {
            CarId = req.CarId, ClientId = req.ClientId, EmployeeId = req.EmployeeId,
            DealDate = DateTime.SpecifyKind(req.DealDate, DateTimeKind.Utc),
            FinalPrice = req.FinalPrice, PaymentType = req.PaymentType, Notes = req.Notes
        };
        db.Deals.Add(deal);
        await db.SaveChangesAsync();
        var created = await WithIncludes().FirstAsync(d => d.DealId == deal.DealId);
        await audit.LogAsync(User, "Deal", deal.DealId, "CREATE", new { req.CarId, req.ClientId, req.FinalPrice });
        return Ok(Map(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] DealRequest req)
    {
        var deal = await db.Deals.FindAsync(id);
        if (deal == null) return NotFound();
        deal.CarId = req.CarId; deal.ClientId = req.ClientId; deal.EmployeeId = req.EmployeeId;
        deal.DealDate = DateTime.SpecifyKind(req.DealDate, DateTimeKind.Utc);
        deal.FinalPrice = req.FinalPrice; deal.PaymentType = req.PaymentType; deal.Notes = req.Notes;
        await db.SaveChangesAsync();
        var updated = await WithIncludes().FirstAsync(d => d.DealId == id);
        await audit.LogAsync(User, "Deal", id, "UPDATE", new { req.CarId, req.ClientId, req.FinalPrice });
        return Ok(Map(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deal = await db.Deals.FindAsync(id);
        if (deal == null) return NotFound();
        db.Deals.Remove(deal);
        await db.SaveChangesAsync();
        await audit.LogAsync(User, "Deal", id, "DELETE");
        return NoContent();
    }
}
