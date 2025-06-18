using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly ApiDigitalDbContext _context;

    public UsuariosController(ApiDigitalDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsuarioDto>>> GetUsuarios()
    {
        var usuarios = await _context.Usuarios
            .Include(u => u.Rol)
            .Select(u => new UsuarioDto
            {
                UsuarioId = u.UsuarioId,
                Nombre = u.Nombre,
                Apellido = u.Apellido,
                Dni = u.Dni,
                Email = u.Email,
                RolId = u.RolId,
                RolNombre = u.Rol.RolNombre
            })
            .ToListAsync();

        return Ok(usuarios);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UsuarioDto>> GetUsuario(int id)
    {
        var usuario = await _context.Usuarios
            .Include(u => u.Rol)
            .Where(u => u.UsuarioId == id)
            .Select(u => new UsuarioDto
            {
                UsuarioId = u.UsuarioId,
                Nombre = u.Nombre,
                Apellido = u.Apellido,
                Dni = u.Dni,
                Email = u.Email,
                RolId = u.RolId,
                RolNombre = u.Rol.RolNombre
            })
            .FirstOrDefaultAsync();

        if (usuario == null)
            return NotFound();

        return Ok(usuario);
    }

    // Nuevo endpoint para buscar usuario por email
    [HttpGet("email/{email}")]
    public async Task<ActionResult<UsuarioDto>> GetUsuarioPorEmail(string email)
    {
        var usuario = await _context.Usuarios
            .Include(u => u.Rol)
            .Where(u => u.Email.ToLower() == email.ToLower())
            .Select(u => new UsuarioDto
            {
                UsuarioId = u.UsuarioId,
                Nombre = u.Nombre,
                Apellido = u.Apellido,
                Dni = u.Dni,
                Email = u.Email,
                RolId = u.RolId,
                RolNombre = u.Rol.RolNombre
            })
            .FirstOrDefaultAsync();

        if (usuario == null)
            return NotFound();

        return Ok(usuario);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UsuarioDto>> CreateUsuario(CreateUsuarioDto dto)
    {
        var rolExiste = await _context.Roles.AnyAsync(r => r.RolId == dto.RolId);
        if (!rolExiste)
            return BadRequest("El rol especificado no existe.");

        var usuario = new Usuario
        {
            Nombre = dto.Nombre,
            Apellido = dto.Apellido,
            Dni = dto.Dni,
            Email = dto.Email,
            Contraseña = dto.Contrasenia,
            RolId = dto.RolId
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUsuario), new { id = usuario.UsuarioId }, new UsuarioDto
        {
            UsuarioId = usuario.UsuarioId,
            Nombre = usuario.Nombre,
            Apellido = usuario.Apellido,
            Dni = usuario.Dni,
            Email = usuario.Email,
            RolId = usuario.RolId,
            RolNombre = (await _context.Roles.FindAsync(usuario.RolId))?.RolNombre ?? ""
        });
    }

    [HttpPut("{id}")]
    // [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUsuario(int id, UsuarioActualizarDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null)
            return NotFound();

        var rolExiste = await _context.Roles.AnyAsync(r => r.RolId == dto.RolId);
        if (!rolExiste)
            return BadRequest("El rol especificado no existe.");

        usuario.Nombre = dto.Nombre;
        usuario.Apellido = dto.Apellido;
        usuario.Dni = dto.Dni;
        usuario.Email = dto.Email;
        usuario.RolId = dto.RolId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUsuario(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null)
            return NotFound();

        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}