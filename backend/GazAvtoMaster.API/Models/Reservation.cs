namespace GazAvtoMaster.API.Models;

public class Reservation
{
    public int ReservationId { get; set; }
    public int CarId { get; set; }
    public int ClientId { get; set; }
    public int EmployeeId { get; set; }
    public DateTime ReservationDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public decimal Deposit { get; set; }
    public Car Car { get; set; } = null!;
    public Client Client { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}
