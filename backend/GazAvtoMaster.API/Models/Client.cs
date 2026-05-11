namespace GazAvtoMaster.API.Models;

public class Client
{
    public int ClientId { get; set; }
    public string LastName { get; set; } = "";
    public string FirstName { get; set; } = "";
    public string Patronymic { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string PassportSeries { get; set; } = "";
    public string PassportNumber { get; set; } = "";
    public DateTime BirthDate { get; set; }
    public string Address { get; set; } = "";
    public ICollection<Deal> Deals { get; set; } = [];
    public ICollection<Reservation> Reservations { get; set; } = [];
    public ICollection<TestDrive> TestDrives { get; set; } = [];
}
