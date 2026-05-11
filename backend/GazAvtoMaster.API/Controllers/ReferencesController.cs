using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReferencesController : ControllerBase
{
    [HttpGet("brands")]
    public IActionResult Brands() =>
        Ok(MockData.Brands.Select(b => new BrandDto(b.BrandId, b.BrandName, b.Country)));

    [HttpGet("models")]
    public IActionResult Models() =>
        Ok(MockData.Models.Select(m => {
            var b = MockData.Brands.FirstOrDefault(x => x.BrandId == m.BrandId);
            return new ModelDto(m.ModelId, m.BrandId, b?.BrandName ?? "", m.ModelName, m.BodyType, m.EngineVol, m.FuelType);
        }));

    [HttpGet("statuses")]
    public IActionResult Statuses() =>
        Ok(MockData.Statuses.Select(s => new StatusDto(s.StatusId, s.StatusName)));

    [HttpGet("roles")]
    public IActionResult Roles() =>
        Ok(MockData.Roles.Select(r => new RoleDto(r.RoleId, r.RoleName)));
}
