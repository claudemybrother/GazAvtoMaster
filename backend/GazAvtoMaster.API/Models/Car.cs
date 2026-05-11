namespace GazAvtoMaster.API.Models;

public class Car
{
    public int CarId { get; set; }
    public string Vin { get; set; } = "";
    public int ModelId { get; set; }
    public int Year { get; set; }
    public string Color { get; set; } = "";
    public int Mileage { get; set; }
    public decimal Price { get; set; }
    public int StatusId { get; set; }
    public DateTime ArrivalDate { get; set; }
    public string? Notes { get; set; }
    public CarModel Model { get; set; } = null!;
    public Status Status { get; set; } = null!;
    public ICollection<Deal> Deals { get; set; } = [];
    public ICollection<Reservation> Reservations { get; set; } = [];
    public ICollection<TestDrive> TestDrives { get; set; } = [];
}
