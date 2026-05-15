using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.Models;
using System.Security.Claims;
using System.Text.Json;

namespace GazAvtoMaster.API.Services;

public class AuditService(AppDbContext db)
{
    public async Task LogAsync(ClaimsPrincipal user, string entityType, int entityId, string action, object? changes = null)
    {
        var empIdStr = user.FindFirstValue("employeeId") ?? "0";
        var empName  = user.FindFirstValue("fullName") ?? "Неизвестно";
        int.TryParse(empIdStr, out var empId);

        db.AuditLogs.Add(new AuditLog
        {
            EntityType   = entityType,
            EntityId     = entityId,
            Action       = action,
            EmployeeId   = empId,
            EmployeeName = empName,
            ChangesJson  = changes != null ? JsonSerializer.Serialize(changes) : "{}",
            CreatedAt    = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
    }
}
