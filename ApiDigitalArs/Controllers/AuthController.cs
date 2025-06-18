using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ApiDigitalArs.Models;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApiDigitalDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ApiDigitalDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("loginUsuario")]
    public async Task<IActionResult> LoginUsuario([FromBody] LoginRequest request)
    {
        var usuario = await _context.Usuarios
            .Include(u => u.Rol)
            .FirstOrDefaultAsync(u => u.Email == request.Username);

        if (usuario == null)
            return Unauthorized("Usuario no encontrado");

        if (usuario.Contraseña != request.Password)
            return Unauthorized("Contraseña incorrecta");

        // Crear token JWT
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol.RolNombre),
                new Claim("UsuarioId", usuario.UsuarioId.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        // Obtener la cuenta asociada al usuario
        var cuenta = await _context.Cuentas.FirstOrDefaultAsync(c => c.UsuarioId == usuario.UsuarioId);

        return Ok(new
        {
            token = tokenHandler.WriteToken(token),
            nombre = usuario.Nombre,
            usuarioId = usuario.UsuarioId,
            rol = usuario.Rol.RolNombre,
            cuentaId = cuenta?.CuentaId,
            saldo = cuenta?.Saldo
        });
    }

    [HttpPost("registerUsuario")]
    // [AllowAnonymous]
    public async Task<IActionResult> RegisterUsuario(RegisterUsuarioDto dto)
    {
        var usuarioExistente = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email || u.Dni == dto.Dni);

        if (usuarioExistente != null)
        {
            return BadRequest("Ya existe un usuario con ese email o DNI.");
        }

        var nuevoUsuario = new Usuario
        {
            Nombre = dto.Nombre,
            Apellido = dto.Apellido,
            Dni = dto.Dni,
            Email = dto.Email,
            Contraseña = dto.Contraseña,
            RolId = 1
        };

        _context.Usuarios.Add(nuevoUsuario);
        await _context.SaveChangesAsync();

        Console.WriteLine("Usuario ID generado: " + nuevoUsuario.UsuarioId);

        var cuenta = new Cuenta
        {
            UsuarioId = nuevoUsuario.UsuarioId,
            Moneda = "Peso",
            Saldo = 0,
            FechaCreacion = DateTime.UtcNow
        };

        _context.Cuentas.Add(cuenta);

        try
        {
            await _context.SaveChangesAsync();
            Console.WriteLine("Cuenta creada correctamente.");
            return Ok("Usuario y cuenta creados.");
        }
        catch (DbUpdateException ex)
        {
            Console.WriteLine("Error al crear cuenta: " + ex.InnerException?.Message ?? ex.Message);
            return BadRequest("Error al crear la cuenta.");
        }

    }
}