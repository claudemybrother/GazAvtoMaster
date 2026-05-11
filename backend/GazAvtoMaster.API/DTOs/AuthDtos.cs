namespace GazAvtoMaster.API.DTOs;

public record LoginRequest(string Login, string Password);

public record LoginResponse(
    string Token,
    string FullName,
    string Role,
    int EmployeeId
);

public record CarDto(
    int CarId, string Vin, int ModelId, string ModelName, string BrandName,
    int Year, string Color, int Mileage, decimal Price,
    int StatusId, string StatusName, DateTime ArrivalDate, string? Notes
);

public record ClientDto(
    int ClientId, string LastName, string FirstName, string Patronymic,
    string Phone, string Email, string PassportSeries, string PassportNumber,
    DateTime BirthDate, string Address
);

public record EmployeeDto(
    int EmployeeId, string LastName, string FirstName, string Patronymic,
    int RoleId, string RoleName, string Phone, string Email,
    DateTime HireDate, string Login
);

public record DealDto(
    int DealId, int CarId, string CarInfo, int ClientId, string ClientName,
    int EmployeeId, string EmployeeName, DateTime DealDate,
    decimal FinalPrice, string PaymentType, string? Notes
);

public record ReservationDto(
    int ReservationId, int CarId, string CarInfo, int ClientId, string ClientName,
    int EmployeeId, string EmployeeName, DateTime ReservationDate,
    DateTime ExpiryDate, decimal Deposit
);

public record TestDriveDto(
    int TdId, int CarId, string CarInfo, int ClientId, string ClientName,
    int EmployeeId, string EmployeeName, DateTime TdDate, string? Feedback
);

public record BrandDto(int BrandId, string BrandName, string Country);
public record ModelDto(int ModelId, int BrandId, string BrandName, string ModelName, string BodyType, decimal EngineVol, string FuelType);
public record StatusDto(int StatusId, string StatusName);
public record RoleDto(int RoleId, string RoleName);

public record DashboardStats(
    int TotalCars, int AvailableCars, int ReservedCars, int SoldCars,
    int TotalClients, int TotalDeals, int ActiveReservations, int TotalTestDrives,
    decimal TotalRevenue
);
