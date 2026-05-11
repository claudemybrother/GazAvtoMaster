namespace GazAvtoMaster.API.Models;

public class TestDrive
{
    public int TdId { get; set; }
    public int CarId { get; set; }
    public int ClientId { get; set; }
    public int EmployeeId { get; set; }
    public DateTime TdDate { get; set; }
    public string? Feedback { get; set; }
    public Car Car { get; set; } = null!;
    public Client Client { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}
