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
public class TestDrivesController(AppDbContext db) : ControllerBase
{
    private static TestDriveDto Map(TestDrive t) =>
        new(t.TdId, t.CarId,
            $"{t.Car?.Model?.Brand?.BrandName} {t.Car?.Model?.ModelName} ({t.Car?.Year})",
            t.ClientId, $"{t.Client?.LastName} {t.Client?.FirstName}",
            t.EmployeeId, $"{t.Employee?.LastName} {t.Employee?.FirstName}",
            t.TdDate, t.Feedback);

    private IQueryable<TestDrive> WithIncludes() =>
        db.TestDrives
            .Include(t => t.Car).ThenInclude(c => c.Model).ThenInclude(m => m.Brand)
            .Include(t => t.Client)
            .Include(t => t.Employee);

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok((await WithIncludes().ToListAsync()).Select(Map));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TestDriveRequest req)
    {
        var t = new TestDrive
        {
            CarId = req.CarId, ClientId = req.ClientId, EmployeeId = req.EmployeeId,
            TdDate = DateTime.SpecifyKind(req.TdDate, DateTimeKind.Utc),
            Feedback = req.Feedback
        };
        db.TestDrives.Add(t);
        await db.SaveChangesAsync();
        var created = await WithIncludes().FirstAsync(x => x.TdId == t.TdId);
        return Ok(Map(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TestDriveRequest req)
    {
        var t = await db.TestDrives.FindAsync(id);
        if (t == null) return NotFound();
        t.CarId = req.CarId; t.ClientId = req.ClientId; t.EmployeeId = req.EmployeeId;
        t.TdDate = DateTime.SpecifyKind(req.TdDate, DateTimeKind.Utc);
        t.Feedback = req.Feedback;
        await db.SaveChangesAsync();
        var updated = await WithIncludes().FirstAsync(x => x.TdId == id);
        return Ok(Map(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var t = await db.TestDrives.FindAsync(id);
        if (t == null) return NotFound();
        db.TestDrives.Remove(t);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
