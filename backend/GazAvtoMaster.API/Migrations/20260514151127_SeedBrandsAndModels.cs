using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GazAvtoMaster.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedBrandsAndModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "brands",
                columns: new[] { "brand_id", "brand_name", "country" },
                values: new object[,]
                {
                    { 1, "LADA (ВАЗ)", "Россия" },
                    { 2, "GAZ (ГАЗ)", "Россия" },
                    { 3, "UAZ (УАЗ)", "Россия" },
                    { 4, "Toyota", "Япония" },
                    { 5, "Hyundai", "Корея" },
                    { 6, "KIA", "Корея" },
                    { 7, "Volkswagen", "Германия" },
                    { 8, "Skoda", "Чехия" },
                    { 9, "Renault", "Франция" },
                    { 10, "Nissan", "Япония" }
                });

            migrationBuilder.UpdateData(
                table: "employees",
                keyColumn: "employee_id",
                keyValue: 1,
                column: "password",
                value: "$2a$11$5Ba2UJPbEC5s6aecWLoFf.Tk.JJ0jldkDzN9lx/oVcxnAtIRC3XHi");

            migrationBuilder.InsertData(
                table: "models",
                columns: new[] { "model_id", "body_type", "brand_id", "engine_vol", "fuel_type", "model_name" },
                values: new object[,]
                {
                    { 1, "Седан", 1, 1.6m, "Бензин", "Vesta" },
                    { 2, "Седан", 1, 1.6m, "Бензин", "Granta" },
                    { 3, "Внедорожник", 1, 1.7m, "Бензин", "Niva Legend" },
                    { 4, "Кроссовер", 1, 1.6m, "Бензин", "XRAY" },
                    { 5, "Микроавтобус", 2, 2.7m, "Бензин", "Газель Next" },
                    { 6, "Микроавтобус", 2, 2.3m, "Бензин", "Sobol" },
                    { 7, "Внедорожник", 3, 2.7m, "Бензин", "Patriot" },
                    { 8, "Внедорожник", 3, 2.7m, "Бензин", "Hunter" },
                    { 9, "Седан", 4, 2.5m, "Бензин", "Camry" },
                    { 10, "Кроссовер", 4, 2.0m, "Бензин", "RAV4" },
                    { 11, "Внедорожник", 4, 4.0m, "Бензин", "Land Cruiser" },
                    { 12, "Седан", 5, 1.6m, "Бензин", "Solaris" },
                    { 13, "Кроссовер", 5, 1.6m, "Бензин", "Creta" },
                    { 14, "Кроссовер", 5, 2.0m, "Бензин", "Tucson" },
                    { 15, "Седан", 6, 1.6m, "Бензин", "Rio" },
                    { 16, "Кроссовер", 6, 2.0m, "Бензин", "Sportage" },
                    { 17, "Седан", 6, 2.5m, "Бензин", "K5" },
                    { 18, "Седан", 7, 1.6m, "Бензин", "Polo" },
                    { 19, "Кроссовер", 7, 2.0m, "Бензин", "Tiguan" },
                    { 20, "Седан", 8, 1.4m, "Бензин", "Octavia" },
                    { 21, "Лифтбек", 8, 1.6m, "Бензин", "Rapid" },
                    { 22, "Седан", 9, 1.6m, "Бензин", "Logan" },
                    { 23, "Кроссовер", 9, 2.0m, "Бензин", "Duster" },
                    { 24, "Кроссовер", 10, 2.0m, "Бензин", "Qashqai" },
                    { 25, "Кроссовер", 10, 2.5m, "Бензин", "X-Trail" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "models",
                keyColumn: "model_id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "brands",
                keyColumn: "brand_id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "brands",
                keyColumn: "brand_id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "brands",
                keyColumn: "brand_id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "brands",
                keyColumn: "brand_id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "brands",
                keyColumn: "brand_id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "brands",
                keyColumn: "brand_id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "brands",
                keyColumn: "brand_id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "brands",
                keyColumn: "brand_id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "brands",
                keyColumn: "brand_id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "brands",
                keyColumn: "brand_id",
                keyValue: 10);

            migrationBuilder.UpdateData(
                table: "employees",
                keyColumn: "employee_id",
                keyValue: 1,
                column: "password",
                value: "$2a$11$Iw2MzVeDh/CXbjq.lZelxOKkQ2wlyVCrJSR7Eq401/art70lc7b5.");
        }
    }
}
