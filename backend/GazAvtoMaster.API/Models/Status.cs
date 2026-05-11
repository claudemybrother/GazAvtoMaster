namespace GazAvtoMaster.API.Models;

public class Status
{
    public int StatusId { get; set; }
    public string StatusName { get; set; } = "";
    public ICollection<Car> Cars { get; set; } = [];
}
