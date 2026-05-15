using GazAvtoMaster.API.Data;
using GazAvtoMaster.API.DTOs;
using GazAvtoMaster.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GazAvtoMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReferencesController(AppDbContext db) : ControllerBase
{
    // ── GET ──────────────────────────────────────────────
    [HttpGet("brands")]
    public async Task<IActionResult> Brands() =>
        Ok((await db.Brands.OrderBy(b => b.BrandName).ToListAsync())
            .Select(b => new BrandDto(b.BrandId, b.BrandName, b.Country)));

    [HttpGet("models")]
    public async Task<IActionResult> Models() =>
        Ok((await db.Models.Include(m => m.Brand).OrderBy(m => m.Brand.BrandName).ThenBy(m => m.ModelName).ToListAsync())
            .Select(m => new ModelDto(m.ModelId, m.BrandId, m.Brand?.BrandName ?? "", m.ModelName, m.BodyType, m.EngineVol, m.FuelType)));

    [HttpGet("statuses")]
    public async Task<IActionResult> Statuses() =>
        Ok((await db.Statuses.ToListAsync())
            .Select(s => new StatusDto(s.StatusId, s.StatusName)));

    [HttpGet("roles")]
    public async Task<IActionResult> Roles() =>
        Ok((await db.Roles.ToListAsync())
            .Select(r => new RoleDto(r.RoleId, r.RoleName)));

    // ── BRANDS CRUD (admin only) ──────────────────────────
    [HttpPost("brands")]
    [Authorize(Roles = "Администратор")]
    public async Task<IActionResult> CreateBrand([FromBody] BrandRequest req)
    {
        var brand = new Brand { BrandName = req.BrandName, Country = req.Country };
        db.Brands.Add(brand);
        await db.SaveChangesAsync();
        return Ok(new BrandDto(brand.BrandId, brand.BrandName, brand.Country));
    }

    [HttpPut("brands/{id}")]
    [Authorize(Roles = "Администратор")]
    public async Task<IActionResult> UpdateBrand(int id, [FromBody] BrandRequest req)
    {
        var brand = await db.Brands.FindAsync(id);
        if (brand == null) return NotFound();
        brand.BrandName = req.BrandName;
        brand.Country = req.Country;
        await db.SaveChangesAsync();
        return Ok(new BrandDto(brand.BrandId, brand.BrandName, brand.Country));
    }

    [HttpDelete("brands/{id}")]
    [Authorize(Roles = "Администратор")]
    public async Task<IActionResult> DeleteBrand(int id)
    {
        var brand = await db.Brands.FindAsync(id);
        if (brand == null) return NotFound();
        var hasModels = await db.Models.AnyAsync(m => m.BrandId == id);
        if (hasModels) return BadRequest(new { message = "Нельзя удалить марку — есть связанные модели" });
        db.Brands.Remove(brand);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ── MODELS CRUD (admin only) ──────────────────────────
    [HttpPost("models")]
    [Authorize(Roles = "Администратор")]
    public async Task<IActionResult> CreateModel([FromBody] ModelRequest req)
    {
        var model = new CarModel
        {
            BrandId = req.BrandId, ModelName = req.ModelName,
            BodyType = req.BodyType, EngineVol = req.EngineVol, FuelType = req.FuelType
        };
        db.Models.Add(model);
        await db.SaveChangesAsync();
        await db.Entry(model).Reference(m => m.Brand).LoadAsync();
        return Ok(new ModelDto(model.ModelId, model.BrandId, model.Brand?.BrandName ?? "", model.ModelName, model.BodyType, model.EngineVol, model.FuelType));
    }

    [HttpPut("models/{id}")]
    [Authorize(Roles = "Администратор")]
    public async Task<IActionResult> UpdateModel(int id, [FromBody] ModelRequest req)
    {
        var model = await db.Models.Include(m => m.Brand).FirstOrDefaultAsync(m => m.ModelId == id);
        if (model == null) return NotFound();
        model.BrandId = req.BrandId; model.ModelName = req.ModelName;
        model.BodyType = req.BodyType; model.EngineVol = req.EngineVol; model.FuelType = req.FuelType;
        await db.SaveChangesAsync();
        await db.Entry(model).Reference(m => m.Brand).LoadAsync();
        return Ok(new ModelDto(model.ModelId, model.BrandId, model.Brand?.BrandName ?? "", model.ModelName, model.BodyType, model.EngineVol, model.FuelType));
    }

    [HttpDelete("models/{id}")]
    [Authorize(Roles = "Администратор")]
    public async Task<IActionResult> DeleteModel(int id)
    {
        var model = await db.Models.FindAsync(id);
        if (model == null) return NotFound();
        var hasCars = await db.Cars.AnyAsync(c => c.ModelId == id);
        if (hasCars) return BadRequest(new { message = "Нельзя удалить модель — есть связанные автомобили" });
        db.Models.Remove(model);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
