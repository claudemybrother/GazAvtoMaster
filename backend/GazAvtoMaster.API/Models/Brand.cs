namespace GazAvtoMaster.API.Models;

public class Brand
{
    public int BrandId { get; set; }
    public string BrandName { get; set; } = "";
    public string Country { get; set; } = "";
    public ICollection<CarModel> Models { get; set; } = [];
}
