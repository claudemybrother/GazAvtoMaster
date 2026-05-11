namespace GazAvtoMaster.API.Models;

public class CarModel
{
    public int ModelId { get; set; }
    public int BrandId { get; set; }
    public string ModelName { get; set; } = "";
    public string BodyType { get; set; } = "";
    public decimal EngineVol { get; set; }
    public string FuelType { get; set; } = "";
    public Brand Brand { get; set; } = null!;
    public ICollection<Car> Cars { get; set; } = [];
}
