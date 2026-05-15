using GazAvtoMaster.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GazAvtoMaster.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<CarModel> Models => Set<CarModel>();
    public DbSet<Status> Statuses => Set<Status>();
    public DbSet<Car> Cars => Set<Car>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Deal> Deals => Set<Deal>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<TestDrive> TestDrives => Set<TestDrive>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Brand>(e =>
        {
            e.ToTable("brands");
            e.HasKey(x => x.BrandId);
            e.Property(x => x.BrandId).HasColumnName("brand_id");
            e.Property(x => x.BrandName).HasColumnName("brand_name").HasMaxLength(100);
            e.Property(x => x.Country).HasColumnName("country").HasMaxLength(100);
        });

        b.Entity<CarModel>(e =>
        {
            e.ToTable("models");
            e.HasKey(x => x.ModelId);
            e.Property(x => x.ModelId).HasColumnName("model_id");
            e.Property(x => x.BrandId).HasColumnName("brand_id");
            e.Property(x => x.ModelName).HasColumnName("model_name").HasMaxLength(100);
            e.Property(x => x.BodyType).HasColumnName("body_type").HasMaxLength(50);
            e.Property(x => x.EngineVol).HasColumnName("engine_vol").HasColumnType("decimal(3,1)");
            e.Property(x => x.FuelType).HasColumnName("fuel_type").HasMaxLength(30);
            e.HasOne(x => x.Brand).WithMany(x => x.Models).HasForeignKey(x => x.BrandId);
        });

        b.Entity<Status>(e =>
        {
            e.ToTable("statuses");
            e.HasKey(x => x.StatusId);
            e.Property(x => x.StatusId).HasColumnName("status_id");
            e.Property(x => x.StatusName).HasColumnName("status_name").HasMaxLength(50);
        });

        b.Entity<Car>(e =>
        {
            e.ToTable("cars");
            e.HasKey(x => x.CarId);
            e.Property(x => x.CarId).HasColumnName("car_id");
            e.Property(x => x.Vin).HasColumnName("vin").HasMaxLength(17).IsFixedLength();
            e.Property(x => x.ModelId).HasColumnName("model_id");
            e.Property(x => x.Year).HasColumnName("year");
            e.Property(x => x.Color).HasColumnName("color").HasMaxLength(50);
            e.Property(x => x.Mileage).HasColumnName("mileage");
            e.Property(x => x.Price).HasColumnName("price").HasColumnType("decimal(12,2)");
            e.Property(x => x.StatusId).HasColumnName("status_id");
            e.Property(x => x.ArrivalDate).HasColumnName("arrival_date");
            e.Property(x => x.Notes).HasColumnName("notes");
            e.HasOne(x => x.Model).WithMany().HasForeignKey(x => x.ModelId);
            e.HasOne(x => x.Status).WithMany(x => x.Cars).HasForeignKey(x => x.StatusId);
        });

        b.Entity<Client>(e =>
        {
            e.ToTable("clients");
            e.HasKey(x => x.ClientId);
            e.Property(x => x.ClientId).HasColumnName("client_id");
            e.Property(x => x.LastName).HasColumnName("last_name").HasMaxLength(100);
            e.Property(x => x.FirstName).HasColumnName("first_name").HasMaxLength(100);
            e.Property(x => x.Patronymic).HasColumnName("patronymic").HasMaxLength(100);
            e.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(20);
            e.Property(x => x.Email).HasColumnName("email").HasMaxLength(150);
            e.Property(x => x.PassportSeries).HasColumnName("passport_series").HasMaxLength(4).IsFixedLength();
            e.Property(x => x.PassportNumber).HasColumnName("passport_number").HasMaxLength(6).IsFixedLength();
            e.Property(x => x.BirthDate).HasColumnName("birth_date");
            e.Property(x => x.Address).HasColumnName("address").HasMaxLength(250);
        });

        b.Entity<Role>(e =>
        {
            e.ToTable("roles");
            e.HasKey(x => x.RoleId);
            e.Property(x => x.RoleId).HasColumnName("role_id");
            e.Property(x => x.RoleName).HasColumnName("role_name").HasMaxLength(50);
        });

        b.Entity<Employee>(e =>
        {
            e.ToTable("employees");
            e.HasKey(x => x.EmployeeId);
            e.Property(x => x.EmployeeId).HasColumnName("employee_id");
            e.Property(x => x.LastName).HasColumnName("last_name").HasMaxLength(100);
            e.Property(x => x.FirstName).HasColumnName("first_name").HasMaxLength(100);
            e.Property(x => x.Patronymic).HasColumnName("patronymic").HasMaxLength(100);
            e.Property(x => x.RoleId).HasColumnName("role_id");
            e.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(20);
            e.Property(x => x.Email).HasColumnName("email").HasMaxLength(150);
            e.Property(x => x.HireDate).HasColumnName("hire_date");
            e.Property(x => x.Login).HasColumnName("login").HasMaxLength(100);
            e.Property(x => x.Password).HasColumnName("password");
            e.HasOne(x => x.Role).WithMany(x => x.Employees).HasForeignKey(x => x.RoleId);
        });

        b.Entity<Deal>(e =>
        {
            e.ToTable("deals");
            e.HasKey(x => x.DealId);
            e.Property(x => x.DealId).HasColumnName("deal_id");
            e.Property(x => x.CarId).HasColumnName("car_id");
            e.Property(x => x.ClientId).HasColumnName("client_id");
            e.Property(x => x.EmployeeId).HasColumnName("employee_id");
            e.Property(x => x.DealDate).HasColumnName("deal_date");
            e.Property(x => x.FinalPrice).HasColumnName("final_price").HasColumnType("decimal(12,2)");
            e.Property(x => x.PaymentType).HasColumnName("payment_type").HasMaxLength(30);
            e.Property(x => x.Notes).HasColumnName("notes");
            e.HasOne(x => x.Car).WithMany(x => x.Deals).HasForeignKey(x => x.CarId);
            e.HasOne(x => x.Client).WithMany(x => x.Deals).HasForeignKey(x => x.ClientId);
            e.HasOne(x => x.Employee).WithMany(x => x.Deals).HasForeignKey(x => x.EmployeeId);
        });

        b.Entity<Reservation>(e =>
        {
            e.ToTable("reservations");
            e.HasKey(x => x.ReservationId);
            e.Property(x => x.ReservationId).HasColumnName("reservation_id");
            e.Property(x => x.CarId).HasColumnName("car_id");
            e.Property(x => x.ClientId).HasColumnName("client_id");
            e.Property(x => x.EmployeeId).HasColumnName("employee_id");
            e.Property(x => x.ReservationDate).HasColumnName("reservation_date");
            e.Property(x => x.ExpiryDate).HasColumnName("expiry_date");
            e.Property(x => x.Deposit).HasColumnName("deposit").HasColumnType("decimal(12,2)");
            e.HasOne(x => x.Car).WithMany(x => x.Reservations).HasForeignKey(x => x.CarId);
            e.HasOne(x => x.Client).WithMany(x => x.Reservations).HasForeignKey(x => x.ClientId);
            e.HasOne(x => x.Employee).WithMany(x => x.Reservations).HasForeignKey(x => x.EmployeeId);
        });

        b.Entity<TestDrive>(e =>
        {
            e.ToTable("test_drives");
            e.HasKey(x => x.TdId);
            e.Property(x => x.TdId).HasColumnName("td_id");
            e.Property(x => x.CarId).HasColumnName("car_id");
            e.Property(x => x.ClientId).HasColumnName("client_id");
            e.Property(x => x.EmployeeId).HasColumnName("employee_id");
            e.Property(x => x.TdDate).HasColumnName("td_date");
            e.Property(x => x.Feedback).HasColumnName("feedback");
            e.HasOne(x => x.Car).WithMany(x => x.TestDrives).HasForeignKey(x => x.CarId);
            e.HasOne(x => x.Client).WithMany(x => x.TestDrives).HasForeignKey(x => x.ClientId);
            e.HasOne(x => x.Employee).WithMany(x => x.TestDrives).HasForeignKey(x => x.EmployeeId);
        });

        SeedData(b);
    }

    private static void SeedData(ModelBuilder b)
    {
        b.Entity<Role>().HasData(
            new Role { RoleId = 1, RoleName = "Администратор" },
            new Role { RoleId = 2, RoleName = "Сотрудник" }
        );

        b.Entity<Employee>().HasData(
            new Employee
            {
                EmployeeId = 1,
                LastName = "Занин",
                FirstName = "Илья",
                Patronymic = "Иванович",
                RoleId = 1,
                Phone = "79998887766",
                Email = "zashekanec2010@gmail.com",
                HireDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                Login = "admin",
                Password = BCrypt.Net.BCrypt.HashPassword("admin")
            }
        );

        b.Entity<Status>().HasData(
            new Status { StatusId = 1, StatusName = "В наличии" },
            new Status { StatusId = 2, StatusName = "Зарезервирован" },
            new Status { StatusId = 3, StatusName = "Продан" }
        );

        b.Entity<Brand>().HasData(
            new Brand { BrandId = 1, BrandName = "LADA (ВАЗ)", Country = "Россия" },
            new Brand { BrandId = 2, BrandName = "GAZ (ГАЗ)",  Country = "Россия" },
            new Brand { BrandId = 3, BrandName = "UAZ (УАЗ)",  Country = "Россия" },
            new Brand { BrandId = 4, BrandName = "Toyota",     Country = "Япония" },
            new Brand { BrandId = 5, BrandName = "Hyundai",    Country = "Корея"  },
            new Brand { BrandId = 6, BrandName = "KIA",        Country = "Корея"  },
            new Brand { BrandId = 7, BrandName = "Volkswagen", Country = "Германия" },
            new Brand { BrandId = 8, BrandName = "Skoda",      Country = "Чехия"  },
            new Brand { BrandId = 9, BrandName = "Renault",    Country = "Франция" },
            new Brand { BrandId = 10, BrandName = "Nissan",    Country = "Япония" }
        );

        b.Entity<CarModel>().HasData(
            // LADA
            new CarModel { ModelId = 1,  BrandId = 1, ModelName = "Vesta",       BodyType = "Седан",    EngineVol = 1.6m, FuelType = "Бензин" },
            new CarModel { ModelId = 2,  BrandId = 1, ModelName = "Granta",      BodyType = "Седан",    EngineVol = 1.6m, FuelType = "Бензин" },
            new CarModel { ModelId = 3,  BrandId = 1, ModelName = "Niva Legend", BodyType = "Внедорожник", EngineVol = 1.7m, FuelType = "Бензин" },
            new CarModel { ModelId = 4,  BrandId = 1, ModelName = "XRAY",        BodyType = "Кроссовер", EngineVol = 1.6m, FuelType = "Бензин" },
            // GAZ
            new CarModel { ModelId = 5,  BrandId = 2, ModelName = "Газель Next", BodyType = "Микроавтобус", EngineVol = 2.7m, FuelType = "Бензин" },
            new CarModel { ModelId = 6,  BrandId = 2, ModelName = "Sobol",       BodyType = "Микроавтобус", EngineVol = 2.3m, FuelType = "Бензин" },
            // UAZ
            new CarModel { ModelId = 7,  BrandId = 3, ModelName = "Patriot",     BodyType = "Внедорожник", EngineVol = 2.7m, FuelType = "Бензин" },
            new CarModel { ModelId = 8,  BrandId = 3, ModelName = "Hunter",      BodyType = "Внедорожник", EngineVol = 2.7m, FuelType = "Бензин" },
            // Toyota
            new CarModel { ModelId = 9,  BrandId = 4, ModelName = "Camry",       BodyType = "Седан",    EngineVol = 2.5m, FuelType = "Бензин" },
            new CarModel { ModelId = 10, BrandId = 4, ModelName = "RAV4",        BodyType = "Кроссовер", EngineVol = 2.0m, FuelType = "Бензин" },
            new CarModel { ModelId = 11, BrandId = 4, ModelName = "Land Cruiser",BodyType = "Внедорожник", EngineVol = 4.0m, FuelType = "Бензин" },
            // Hyundai
            new CarModel { ModelId = 12, BrandId = 5, ModelName = "Solaris",     BodyType = "Седан",    EngineVol = 1.6m, FuelType = "Бензин" },
            new CarModel { ModelId = 13, BrandId = 5, ModelName = "Creta",       BodyType = "Кроссовер", EngineVol = 1.6m, FuelType = "Бензин" },
            new CarModel { ModelId = 14, BrandId = 5, ModelName = "Tucson",      BodyType = "Кроссовер", EngineVol = 2.0m, FuelType = "Бензин" },
            // KIA
            new CarModel { ModelId = 15, BrandId = 6, ModelName = "Rio",         BodyType = "Седан",    EngineVol = 1.6m, FuelType = "Бензин" },
            new CarModel { ModelId = 16, BrandId = 6, ModelName = "Sportage",    BodyType = "Кроссовер", EngineVol = 2.0m, FuelType = "Бензин" },
            new CarModel { ModelId = 17, BrandId = 6, ModelName = "K5",          BodyType = "Седан",    EngineVol = 2.5m, FuelType = "Бензин" },
            // Volkswagen
            new CarModel { ModelId = 18, BrandId = 7, ModelName = "Polo",        BodyType = "Седан",    EngineVol = 1.6m, FuelType = "Бензин" },
            new CarModel { ModelId = 19, BrandId = 7, ModelName = "Tiguan",      BodyType = "Кроссовер", EngineVol = 2.0m, FuelType = "Бензин" },
            // Skoda
            new CarModel { ModelId = 20, BrandId = 8, ModelName = "Octavia",     BodyType = "Седан",    EngineVol = 1.4m, FuelType = "Бензин" },
            new CarModel { ModelId = 21, BrandId = 8, ModelName = "Rapid",       BodyType = "Лифтбек",  EngineVol = 1.6m, FuelType = "Бензин" },
            // Renault
            new CarModel { ModelId = 22, BrandId = 9, ModelName = "Logan",       BodyType = "Седан",    EngineVol = 1.6m, FuelType = "Бензин" },
            new CarModel { ModelId = 23, BrandId = 9, ModelName = "Duster",      BodyType = "Кроссовер", EngineVol = 2.0m, FuelType = "Бензин" },
            // Nissan
            new CarModel { ModelId = 24, BrandId = 10, ModelName = "Qashqai",   BodyType = "Кроссовер", EngineVol = 2.0m, FuelType = "Бензин" },
            new CarModel { ModelId = 25, BrandId = 10, ModelName = "X-Trail",   BodyType = "Кроссовер", EngineVol = 2.5m, FuelType = "Бензин" }
        );

        b.Entity<AuditLog>(e =>
        {
            e.ToTable("audit_logs");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").UseIdentityColumn();
            e.Property(x => x.EntityType).HasColumnName("entity_type").HasMaxLength(50);
            e.Property(x => x.EntityId).HasColumnName("entity_id");
            e.Property(x => x.Action).HasColumnName("action").HasMaxLength(10);
            e.Property(x => x.EmployeeId).HasColumnName("employee_id");
            e.Property(x => x.EmployeeName).HasColumnName("employee_name").HasMaxLength(200);
            e.Property(x => x.ChangesJson).HasColumnName("changes_json").HasColumnType("text");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
        });
    }
}
