using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        var stats = new DashboardStats(
            TotalCars: MockData.Cars.Count,
            AvailableCars: MockData.Cars.Count(c => c.StatusId == 1),
            ReservedCars: MockData.Cars.Count(c => c.StatusId == 2),
            SoldCars: MockData.Cars.Count(c => c.StatusId == 3),
            TotalClients: MockData.Clients.Count,
            TotalDeals: MockData.Deals.Count,
            ActiveReservations: MockData.Reservations.Count,
            TotalTestDrives: MockData.TestDrives.Count,
            TotalRevenue: MockData.Deals.Sum(d => d.FinalPrice)
        );
        return Ok(stats);
    }
}
