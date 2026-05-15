using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/admin/audit")]
[Authorize(Roles = "Администратор")]
public class AuditController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 50)
    {
        var items = await db.AuditLogs
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        var dtos = items.Select(a => new AuditLogDto(
            a.Id, a.EntityType, a.EntityId, a.Action,
            a.EmployeeId, a.EmployeeName, a.ChangesJson, a.CreatedAt
        ));

        return Ok(dtos);
    }
}
