using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientsController : ControllerBase
{
    private static ClientDto Map(GazAvtoMaster.API.Models.Client c) =>
        new(c.ClientId, c.LastName, c.FirstName, c.Patronymic,
            c.Phone, c.Email, c.PassportSeries, c.PassportNumber,
            c.BirthDate, c.Address);

    [HttpGet]
    public IActionResult GetAll() => Ok(MockData.Clients.Select(Map));

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var c = MockData.Clients.FirstOrDefault(x => x.ClientId == id);
        return c == null ? NotFound() : Ok(Map(c));
    }
}
