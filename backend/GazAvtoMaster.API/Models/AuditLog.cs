namespace GazAvtoMaster.API.Models;

public class AuditLog
{
    public int Id { get; set; }
    public string EntityType { get; set; } = "";
    public int EntityId { get; set; }
    public string Action { get; set; } = "";   // CREATE / UPDATE / DELETE
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = "";
    public string ChangesJson { get; set; } = "{}";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
