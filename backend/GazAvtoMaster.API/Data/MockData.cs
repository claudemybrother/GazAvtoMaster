using GazAvtoMaster.API.Models;

namespace GazAvtoMaster.API.Data;

public static class MockData
{
    public static List<Role> Roles { get; } =
    [
        new() { RoleId = 1, RoleName = "Администратор" },
        new() { RoleId = 2, RoleName = "Менеджер" },
        new() { RoleId = 3, RoleName = "Кладовщик" },
    ];

    public static List<Brand> Brands { get; } =
    [
        new() { BrandId = 1, BrandName = "Toyota",     Country = "Япония" },
        new() { BrandId = 2, BrandName = "Volkswagen", Country = "Германия" },
        new() { BrandId = 3, BrandName = "Kia",        Country = "Южная Корея" },
        new() { BrandId = 4, BrandName = "Lada",       Country = "Россия" },
        new() { BrandId = 5, BrandName = "BMW",        Country = "Германия" },
    ];

    public static List<CarModel> Models { get; } =
    [
        new() { ModelId = 1, BrandId = 1, ModelName = "Camry",     BodyType = "Седан",      EngineVol = 2.5m, FuelType = "Бензин" },
        new() { ModelId = 2, BrandId = 1, ModelName = "RAV4",      BodyType = "Внедорожник",EngineVol = 2.0m, FuelType = "Бензин" },
        new() { ModelId = 3, BrandId = 2, ModelName = "Passat",    BodyType = "Седан",      EngineVol = 1.8m, FuelType = "Бензин" },
        new() { ModelId = 4, BrandId = 2, ModelName = "Tiguan",    BodyType = "Внедорожник",EngineVol = 2.0m, FuelType = "Дизель" },
        new() { ModelId = 5, BrandId = 3, ModelName = "Sportage",  BodyType = "Внедорожник",EngineVol = 2.0m, FuelType = "Бензин" },
        new() { ModelId = 6, BrandId = 4, ModelName = "Vesta",     BodyType = "Седан",      EngineVol = 1.6m, FuelType = "Бензин" },
        new() { ModelId = 7, BrandId = 5, ModelName = "X5",        BodyType = "Внедорожник",EngineVol = 3.0m, FuelType = "Бензин" },
    ];

    public static List<Status> Statuses { get; } =
    [
        new() { StatusId = 1, StatusName = "В наличии" },
        new() { StatusId = 2, StatusName = "Зарезервирован" },
        new() { StatusId = 3, StatusName = "Продан" },
    ];

    public static List<Car> Cars { get; } =
    [
        new() { CarId=1, Vin="JT2BF12K1W0123456", ModelId=1, Year=2022, Color="Белый",    Mileage=0,    Price=2_850_000m, StatusId=1, ArrivalDate=new DateTime(2024,1,10), Notes="Полная комплектация" },
        new() { CarId=2, Vin="JT2BF12K1W0234567", ModelId=2, Year=2023, Color="Чёрный",   Mileage=5000, Price=3_200_000m, StatusId=1, ArrivalDate=new DateTime(2024,2,15) },
        new() { CarId=3, Vin="WVWZZZ3CZ8E023456", ModelId=3, Year=2021, Color="Серебристый",Mileage=30000,Price=1_750_000m,StatusId=2, ArrivalDate=new DateTime(2023,11,5) },
        new() { CarId=4, Vin="WVGZZZ5NZ9W034567", ModelId=4, Year=2022, Color="Синий",    Mileage=12000,Price=2_400_000m, StatusId=1, ArrivalDate=new DateTime(2024,3,1) },
        new() { CarId=5, Vin="KNAFU4A25A5345678", ModelId=5, Year=2023, Color="Красный",  Mileage=0,    Price=2_650_000m, StatusId=1, ArrivalDate=new DateTime(2024,4,20) },
        new() { CarId=6, Vin="XTA210500L2456789", ModelId=6, Year=2023, Color="Белый",    Mileage=0,    Price=980_000m,   StatusId=3, ArrivalDate=new DateTime(2023,12,1) },
        new() { CarId=7, Vin="WBAFW810X0DT67890", ModelId=7, Year=2022, Color="Чёрный",   Mileage=15000,Price=6_800_000m, StatusId=1, ArrivalDate=new DateTime(2024,1,25) },
        new() { CarId=8, Vin="JT2BF12K1W0345678", ModelId=1, Year=2021, Color="Серый",    Mileage=45000,Price=2_100_000m, StatusId=2, ArrivalDate=new DateTime(2023,9,15) },
    ];

    public static List<Client> Clients { get; } =
    [
        new() { ClientId=1, LastName="Петров",   FirstName="Алексей",  Patronymic="Иванович",  Phone="+7(912)345-67-89", Email="petrov@mail.ru",  PassportSeries="4521", PassportNumber="987654", BirthDate=new DateTime(1985,3,12), Address="г. Москва, ул. Ленина, д. 5" },
        new() { ClientId=2, LastName="Сидорова", FirstName="Мария",    Patronymic="Сергеевна", Phone="+7(903)456-78-90", Email="sidorova@gmail.com",PassportSeries="4522",PassportNumber="123456",BirthDate=new DateTime(1990,7,25),Address="г. Москва, пр. Мира, д. 12" },
        new() { ClientId=3, LastName="Козлов",   FirstName="Дмитрий",  Patronymic="Олегович",  Phone="+7(916)567-89-01", Email="kozlov@yandex.ru",PassportSeries="4523",PassportNumber="234567",BirthDate=new DateTime(1978,11,8),Address="г. Казань, ул. Баумана, д. 33" },
        new() { ClientId=4, LastName="Новикова", FirstName="Елена",    Patronymic="Петровна",  Phone="+7(925)678-90-12", Email="novikova@mail.ru",PassportSeries="4524",PassportNumber="345678",BirthDate=new DateTime(1995,4,30),Address="г. Екатеринбург, ул. 8 Марта, д. 7" },
        new() { ClientId=5, LastName="Федоров",  FirstName="Николай",  Patronymic="Андреевич", Phone="+7(977)789-01-23", Email="fedorov@inbox.ru",PassportSeries="4525",PassportNumber="456789",BirthDate=new DateTime(1982,9,15),Address="г. Нижний Новгород, ул. Советская, д. 21" },
    ];

    public static List<Employee> Employees { get; } =
    [
        new() { EmployeeId=1, LastName="Иванов",   FirstName="Сергей",   Patronymic="Петрович",  RoleId=1, Phone="+7(901)111-22-33", Email="ivanov@gazavto.ru",   HireDate=new DateTime(2020,1,15), Login="123",     Password=BCrypt.Net.BCrypt.HashPassword("123") },
        new() { EmployeeId=2, LastName="Смирнова",  FirstName="Анна",     Patronymic="Владимировна",RoleId=2,Phone="+7(902)222-33-44",Email="smirnova@gazavto.ru",HireDate=new DateTime(2021,3,10),Login="smirnova",Password=BCrypt.Net.BCrypt.HashPassword("pass123") },
        new() { EmployeeId=3, LastName="Морозов",   FirstName="Виктор",   Patronymic="Николаевич",RoleId=2, Phone="+7(903)333-44-55", Email="morozov@gazavto.ru",  HireDate=new DateTime(2022,6,1),  Login="morozov", Password=BCrypt.Net.BCrypt.HashPassword("pass123") },
        new() { EmployeeId=4, LastName="Захарова",  FirstName="Ольга",    Patronymic="Дмитриевна",RoleId=3, Phone="+7(904)444-55-66", Email="zaharova@gazavto.ru", HireDate=new DateTime(2023,2,20), Login="zaharova",Password=BCrypt.Net.BCrypt.HashPassword("pass123") },
    ];

    public static List<Deal> Deals { get; } =
    [
        new() { DealId=1, CarId=6, ClientId=1, EmployeeId=2, DealDate=new DateTime(2024,1,5),  FinalPrice=950_000m,  PaymentType="Наличные",  Notes="Без торга" },
        new() { DealId=2, CarId=3, ClientId=3, EmployeeId=3, DealDate=new DateTime(2024,2,18), FinalPrice=1_700_000m,PaymentType="Кредит",    Notes="ПАО Сбербанк" },
        new() { DealId=3, CarId=8, ClientId=2, EmployeeId=2, DealDate=new DateTime(2024,3,10), FinalPrice=2_050_000m,PaymentType="Лизинг",    Notes=null },
    ];

    public static List<Reservation> Reservations { get; } =
    [
        new() { ReservationId=1, CarId=3, ClientId=3, EmployeeId=3, ReservationDate=new DateTime(2024,4,1), ExpiryDate=new DateTime(2024,4,15), Deposit=50_000m },
        new() { ReservationId=2, CarId=8, ClientId=5, EmployeeId=2, ReservationDate=new DateTime(2024,4,5), ExpiryDate=new DateTime(2024,4,20), Deposit=30_000m },
    ];

    public static List<TestDrive> TestDrives { get; } =
    [
        new() { TdId=1, CarId=1, ClientId=1, EmployeeId=2, TdDate=new DateTime(2024,3,20), Feedback="Отличный автомобиль, хорошая динамика" },
        new() { TdId=2, CarId=5, ClientId=4, EmployeeId=3, TdDate=new DateTime(2024,3,25), Feedback="Понравился салон и управляемость" },
        new() { TdId=3, CarId=7, ClientId=2, EmployeeId=2, TdDate=new DateTime(2024,4,2),  Feedback="Мощный, но расход топлива высокий" },
        new() { TdId=4, CarId=2, ClientId=5, EmployeeId=3, TdDate=new DateTime(2024,4,8),  Feedback=null },
    ];
}
