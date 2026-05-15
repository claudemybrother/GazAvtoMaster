using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(AppDbContext db) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = new DashboardStats(
            TotalCars: await db.Cars.CountAsync(),
            AvailableCars: await db.Cars.CountAsync(c => c.StatusId == 1),
            ReservedCars: await db.Cars.CountAsync(c => c.StatusId == 2),
            SoldCars: await db.Cars.CountAsync(c => c.StatusId == 3),
            TotalClients: await db.Clients.CountAsync(),
            TotalDeals: await db.Deals.CountAsync(),
            ActiveReservations: await db.Reservations.CountAsync(),
            TotalTestDrives: await db.TestDrives.CountAsync(),
            TotalRevenue: await db.Deals.SumAsync(d => d.FinalPrice)
        );
        return Ok(stats);
    }

    // Продажи по месяцам (последние 12 месяцев)
    [HttpGet("monthly-revenue")]
    public async Task<IActionResult> GetMonthlyRevenue()
    {
        var cutoff = DateTime.UtcNow.AddMonths(-11);
        var cutoffMonth = new DateTime(cutoff.Year, cutoff.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var deals = await db.Deals
            .Where(d => d.DealDate >= cutoffMonth)
            .ToListAsync();

        var grouped = deals
            .GroupBy(d => new { d.DealDate.Year, d.DealDate.Month })
            .Select(g => new {
                month = $"{g.Key.Year}-{g.Key.Month:D2}",
                revenue = g.Sum(d => d.FinalPrice),
                count = g.Count()
            })
            .OrderBy(x => x.month)
            .ToList();

        return Ok(grouped);
    }

    // Топ-5 моделей по количеству продаж
    [HttpGet("top-models")]
    public async Task<IActionResult> GetTopModels()
    {
        var top = await db.Deals
            .Include(d => d.Car).ThenInclude(c => c.Model)
            .GroupBy(d => d.Car.Model.ModelName)
            .Select(g => new { model = g.Key, count = g.Count() })
            .OrderByDescending(x => x.count)
            .Take(5)
            .ToListAsync();

        return Ok(top);
    }

    // Распределение автомобилей по статусам
    [HttpGet("status-dist")]
    public async Task<IActionResult> GetStatusDist()
    {
        var dist = await db.Cars
            .Include(c => c.Status)
            .GroupBy(c => c.Status.StatusName)
            .Select(g => new { name = g.Key, value = g.Count() })
            .ToListAsync();

        return Ok(dist);
    }
}
