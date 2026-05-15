using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GazAvtoMaster.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "brands",
                columns: table => new
                {
                    brand_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    brand_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_brands", x => x.brand_id);
                });

            migrationBuilder.CreateTable(
                name: "clients",
                columns: table => new
                {
                    client_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    last_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    first_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    patronymic = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    passport_series = table.Column<string>(type: "character(4)", fixedLength: true, maxLength: 4, nullable: false),
                    passport_number = table.Column<string>(type: "character(6)", fixedLength: true, maxLength: 6, nullable: false),
                    birth_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    address = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clients", x => x.client_id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    role_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    role_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.role_id);
                });

            migrationBuilder.CreateTable(
                name: "statuses",
                columns: table => new
                {
                    status_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    status_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_statuses", x => x.status_id);
                });

            migrationBuilder.CreateTable(
                name: "models",
                columns: table => new
                {
                    model_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    brand_id = table.Column<int>(type: "integer", nullable: false),
                    model_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    body_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    engine_vol = table.Column<decimal>(type: "numeric(3,1)", nullable: false),
                    fuel_type = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_models", x => x.model_id);
                    table.ForeignKey(
                        name: "FK_models_brands_brand_id",
                        column: x => x.brand_id,
                        principalTable: "brands",
                        principalColumn: "brand_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "employees",
                columns: table => new
                {
                    employee_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    last_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    first_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    patronymic = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    role_id = table.Column<int>(type: "integer", nullable: false),
                    phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    hire_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    login = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    password = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employees", x => x.employee_id);
                    table.ForeignKey(
                        name: "FK_employees_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "role_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "cars",
                columns: table => new
                {
                    car_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    vin = table.Column<string>(type: "character(17)", fixedLength: true, maxLength: 17, nullable: false),
                    model_id = table.Column<int>(type: "integer", nullable: false),
                    year = table.Column<int>(type: "integer", nullable: false),
                    color = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    mileage = table.Column<int>(type: "integer", nullable: false),
                    price = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    status_id = table.Column<int>(type: "integer", nullable: false),
                    arrival_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true),
                    CarModelModelId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cars", x => x.car_id);
                    table.ForeignKey(
                        name: "FK_cars_models_CarModelModelId",
                        column: x => x.CarModelModelId,
                        principalTable: "models",
                        principalColumn: "model_id");
                    table.ForeignKey(
                        name: "FK_cars_models_model_id",
                        column: x => x.model_id,
                        principalTable: "models",
                        principalColumn: "model_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_cars_statuses_status_id",
                        column: x => x.status_id,
                        principalTable: "statuses",
                        principalColumn: "status_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "deals",
                columns: table => new
                {
                    deal_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    car_id = table.Column<int>(type: "integer", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    employee_id = table.Column<int>(type: "integer", nullable: false),
                    deal_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    final_price = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    payment_type = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_deals", x => x.deal_id);
                    table.ForeignKey(
                        name: "FK_deals_cars_car_id",
                        column: x => x.car_id,
                        principalTable: "cars",
                        principalColumn: "car_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_deals_clients_client_id",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "client_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_deals_employees_employee_id",
                        column: x => x.employee_id,
                        principalTable: "employees",
                        principalColumn: "employee_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "reservations",
                columns: table => new
                {
                    reservation_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    car_id = table.Column<int>(type: "integer", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    employee_id = table.Column<int>(type: "integer", nullable: false),
                    reservation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    expiry_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    deposit = table.Column<decimal>(type: "numeric(12,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reservations", x => x.reservation_id);
                    table.ForeignKey(
                        name: "FK_reservations_cars_car_id",
                        column: x => x.car_id,
                        principalTable: "cars",
                        principalColumn: "car_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_reservations_clients_client_id",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "client_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_reservations_employees_employee_id",
                        column: x => x.employee_id,
                        principalTable: "employees",
                        principalColumn: "employee_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "test_drives",
                columns: table => new
                {
                    td_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    car_id = table.Column<int>(type: "integer", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    employee_id = table.Column<int>(type: "integer", nullable: false),
                    td_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    feedback = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_test_drives", x => x.td_id);
                    table.ForeignKey(
                        name: "FK_test_drives_cars_car_id",
                        column: x => x.car_id,
                        principalTable: "cars",
                        principalColumn: "car_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_test_drives_clients_client_id",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "client_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_test_drives_employees_employee_id",
                        column: x => x.employee_id,
                        principalTable: "employees",
                        principalColumn: "employee_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "role_id", "role_name" },
                values: new object[,]
                {
                    { 1, "Администратор" },
                    { 2, "Сотрудник" }
                });

            migrationBuilder.InsertData(
                table: "statuses",
                columns: new[] { "status_id", "status_name" },
                values: new object[,]
                {
                    { 1, "В наличии" },
                    { 2, "Зарезервирован" },
                    { 3, "Продан" }
                });

            migrationBuilder.InsertData(
                table: "employees",
                columns: new[] { "employee_id", "email", "first_name", "hire_date", "last_name", "login", "password", "patronymic", "phone", "role_id" },
                values: new object[] { 1, "zashekanec2010@gmail.com", "Илья", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Занин", "admin", "$2a$11$jgs9WeHObe8r/fqi1aADoOI5L0Yt5f.JKtFAsTLpwhOzeLEtdghDS", "Иванович", "79998887766", 1 });

            migrationBuilder.CreateIndex(
                name: "IX_cars_CarModelModelId",
                table: "cars",
                column: "CarModelModelId");

            migrationBuilder.CreateIndex(
                name: "IX_cars_model_id",
                table: "cars",
                column: "model_id");

            migrationBuilder.CreateIndex(
                name: "IX_cars_status_id",
                table: "cars",
                column: "status_id");

            migrationBuilder.CreateIndex(
                name: "IX_deals_car_id",
                table: "deals",
                column: "car_id");

            migrationBuilder.CreateIndex(
                name: "IX_deals_client_id",
                table: "deals",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_deals_employee_id",
                table: "deals",
                column: "employee_id");

            migrationBuilder.CreateIndex(
                name: "IX_employees_role_id",
                table: "employees",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "IX_models_brand_id",
                table: "models",
                column: "brand_id");

            migrationBuilder.CreateIndex(
                name: "IX_reservations_car_id",
                table: "reservations",
                column: "car_id");

            migrationBuilder.CreateIndex(
                name: "IX_reservations_client_id",
                table: "reservations",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_reservations_employee_id",
                table: "reservations",
                column: "employee_id");

            migrationBuilder.CreateIndex(
                name: "IX_test_drives_car_id",
                table: "test_drives",
                column: "car_id");

            migrationBuilder.CreateIndex(
                name: "IX_test_drives_client_id",
                table: "test_drives",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_test_drives_employee_id",
                table: "test_drives",
                column: "employee_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "deals");

            migrationBuilder.DropTable(
                name: "reservations");

            migrationBuilder.DropTable(
                name: "test_drives");

            migrationBuilder.DropTable(
                name: "cars");

            migrationBuilder.DropTable(
                name: "clients");

            migrationBuilder.DropTable(
                name: "employees");

            migrationBuilder.DropTable(
                name: "models");

            migrationBuilder.DropTable(
                name: "statuses");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "brands");
        }
    }
}
