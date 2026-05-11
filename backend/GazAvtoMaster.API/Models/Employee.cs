namespace GazAvtoMaster.API.Models;

public class Employee
{
    public int EmployeeId { get; set; }
    public string LastName { get; set; } = "";
    public string FirstName { get; set; } = "";
    public string Patronymic { get; set; } = "";
    public int RoleId { get; set; }
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public DateTime HireDate { get; set; }
    public string Login { get; set; } = "";
    public string Password { get; set; } = "";
    public Role Role { get; set; } = null!;
    public ICollection<Deal> Deals { get; set; } = [];
    public ICollection<Reservation> Reservations { get; set; } = [];
    public ICollection<TestDrive> TestDrives { get; set; } = [];
}
