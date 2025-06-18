using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly ApiDigitalDbContext _context;

    public RolesController(ApiDigitalDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RolDto>>> GetRoles()
    {
       var roles = await _context.Roles
            .Select(r => new RolDto
            {
                RolId = r.RolId,
                RolNombre = r.RolNombre
            })
            .ToListAsync();

        return Ok(roles);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RolDto>> GetRol(int id)
    {
         var rol = await _context.Roles
            .Where(r => r.RolId == id)
            .Select(r => new RolDto
            {
                RolId = r.RolId,
                RolNombre = r.RolNombre
            })
            .FirstOrDefaultAsync();

        if (rol == null) return NotFound();

        return Ok(rol);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")] 
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<RolDto>> CreateRol(CreateRolDto dto)
    {
        var rol = new Rol
        {
            RolNombre = dto.RolNombre
        };

        _context.Roles.Add(rol);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRol), new { id = rol.RolId }, new RolDto
        {
            RolId = rol.RolId,
            RolNombre = rol.RolNombre
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")] 
    // [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateRol(int id, CreateRolDto dto)
    {
        var rol = await _context.Roles.FindAsync(id);
        if (rol == null) return NotFound();

        rol.RolNombre = dto.RolNombre;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] 
    // [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteRol(int id)
    {
        var rol = await _context.Roles.FindAsync(id);
        if (rol == null) return NotFound();

        _context.Roles.Remove(rol);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}