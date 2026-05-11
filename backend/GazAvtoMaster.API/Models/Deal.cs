namespace GazAvtoMaster.API.Models;

public class Deal
{
    public int DealId { get; set; }
    public int CarId { get; set; }
    public int ClientId { get; set; }
    public int EmployeeId { get; set; }
    public DateTime DealDate { get; set; }
    public decimal FinalPrice { get; set; }
    public string PaymentType { get; set; } = "";
    public string? Notes { get; set; }
    public Car Car { get; set; } = null!;
    public Client Client { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}
