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

public record CarRequest(
    string Vin, int ModelId, int Year, string Color,
    int Mileage, decimal Price, int StatusId, DateTime ArrivalDate, string? Notes
);

public record ClientRequest(
    string LastName, string FirstName, string Patronymic,
    string Phone, string Email, string PassportSeries, string PassportNumber,
    DateTime BirthDate, string Address
);

public record EmployeeRequest(
    string LastName, string FirstName, string Patronymic,
    int RoleId, string Phone, string Email, DateTime HireDate,
    string Login, string? Password
);

public record DealRequest(
    int CarId, int ClientId, int EmployeeId,
    DateTime DealDate, decimal FinalPrice, string PaymentType, string? Notes
);

public record ReservationRequest(
    int CarId, int ClientId, int EmployeeId,
    DateTime ReservationDate, DateTime ExpiryDate, decimal Deposit
);

public record TestDriveRequest(
    int CarId, int ClientId, int EmployeeId, DateTime TdDate, string? Feedback
);

public record DashboardStats(
    int TotalCars, int AvailableCars, int ReservedCars, int SoldCars,
    int TotalClients, int TotalDeals, int ActiveReservations, int TotalTestDrives,
    decimal TotalRevenue
);

public record ClientDetailsDto(
    ClientDto Client,
    IEnumerable<DealDto> Deals,
    IEnumerable<ReservationDto> Reservations,
    IEnumerable<TestDriveDto> TestDrives
);

public record AuditLogDto(
    int Id, string EntityType, int EntityId, string Action,
    int EmployeeId, string EmployeeName, string ChangesJson, DateTime CreatedAt
);

public record BrandRequest(string BrandName, string Country);
public record ModelRequest(int BrandId, string ModelName, string BodyType, decimal EngineVol, string FuelType);
