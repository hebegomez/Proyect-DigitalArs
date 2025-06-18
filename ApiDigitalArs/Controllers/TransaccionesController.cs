using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;

[ApiController]
[Route("api/[controller]")]
public class TransaccionesController : ControllerBase
{
    private readonly ApiDigitalDbContext _context;

    public TransaccionesController(ApiDigitalDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransaccionDto>>> GetTransacciones()
    {
        var transacciones = await _context.Transacciones
            .Select(t => new TransaccionDto
            {
                TransaccionId = t.TransaccionId,
                Monto = t.Monto,
                Fecha = t.Fecha,
                Descripcion = t.Descripcion,
                Estado = t.Estado,
                TipoTransaccion = t.TipoTransaccion,
                CuentaOrigenId = t.CuentaOrigenId,
                CuentaDestinoId = t.CuentaDestinoId
            })
            .ToListAsync();

        return Ok(transacciones);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TransaccionDto>> GetTransaccion(int id)
    {
        var transaccion = await _context.Transacciones
            .Where(t => t.TransaccionId == id)
            .Select(t => new TransaccionDto
            {
                TransaccionId = t.TransaccionId,
                Monto = t.Monto,
                Fecha = t.Fecha,
                Descripcion = t.Descripcion,
                Estado = t.Estado,
                TipoTransaccion = t.TipoTransaccion,
                CuentaOrigenId = t.CuentaOrigenId,
                CuentaDestinoId = t.CuentaDestinoId
            })
            .FirstOrDefaultAsync();

        if (transaccion == null)
        {
            return NotFound();
        }

        return Ok(transaccion);
    }

    [HttpPost]
    public async Task<ActionResult<TransaccionDto>> TransaccionCreate(TransaccionCreateDTO dto)
    {
        try
        {
            Cuenta? cuentaOrigen = null;
            Cuenta? cuentaDestino = null;

            if (dto.CuentaOrigenId.HasValue)
            {
                cuentaOrigen = await _context.Cuentas.FirstOrDefaultAsync(c => c.CuentaId == dto.CuentaOrigenId.Value);
                if (cuentaOrigen == null)
                    return BadRequest("Cuenta origen no existe.");
            }

            if (!string.IsNullOrEmpty(dto.EmailDestino))
            {
                var usuarioDestino = await _context.Usuarios
                    .Include(u => u.Cuentas)
                    .FirstOrDefaultAsync(u => u.Email == dto.EmailDestino);

                if (usuarioDestino == null || usuarioDestino.Cuentas == null || !usuarioDestino.Cuentas.Any())
                    return BadRequest("El destinatario con ese email no existe o no tiene una cuenta asociada.");

                cuentaDestino = usuarioDestino.Cuentas.First();
            }
            else if (dto.CuentaDestinoId.HasValue)
            {
                cuentaDestino = await _context.Cuentas.FirstOrDefaultAsync(c => c.CuentaId == dto.CuentaDestinoId.Value);
                if (cuentaDestino == null)
                    return BadRequest("Cuenta destino no existe.");
            }

            switch (dto.TipoTransaccion.ToLower())
            {
                case "deposito":
                    if (cuentaDestino == null)
                        return BadRequest("Cuenta destino requerida para depósito.");
                    cuentaDestino.Saldo += dto.Monto;
                    break;

                case "retiro":
                    if (cuentaOrigen == null)
                        return BadRequest("Cuenta origen requerida para retiro.");
                    if (cuentaOrigen.Saldo < dto.Monto)
                        return BadRequest("Saldo insuficiente en cuenta origen.");
                    cuentaOrigen.Saldo -= dto.Monto;
                    break;

                case "transferencia":
                    if (cuentaOrigen == null || cuentaDestino == null)
                        return BadRequest("Cuentas origen y destino requeridas para transferencia.");
                    if (cuentaOrigen.Saldo < dto.Monto)
                        return BadRequest("Saldo insuficiente en cuenta origen.");
                    cuentaOrigen.Saldo -= dto.Monto;
                    cuentaDestino.Saldo += dto.Monto;
                    break;

                default:
                    return BadRequest("Tipo de transacción no válido. Debe ser 'deposito', 'retiro' o 'transferencia'.");
            }

            var transaccion = new Transaccion
            {
                Monto = dto.Monto,
                Fecha = DateTime.Now,
                Descripcion = dto.Descripcion,
                Estado = "Completado",
                TipoTransaccion = dto.TipoTransaccion,
                CuentaOrigenId = dto.CuentaOrigenId,
                CuentaDestinoId = cuentaDestino?.CuentaId
            };

            _context.Transacciones.Add(transaccion);
            await _context.SaveChangesAsync();

            var resultDto = new TransaccionDto
            {
                TransaccionId = transaccion.TransaccionId,
                Monto = transaccion.Monto,
                Fecha = transaccion.Fecha,
                Descripcion = transaccion.Descripcion,
                Estado = transaccion.Estado,
                TipoTransaccion = transaccion.TipoTransaccion,
                CuentaOrigenId = transaccion.CuentaOrigenId,
                CuentaDestinoId = transaccion.CuentaDestinoId
            };

            return CreatedAtAction(nameof(GetTransacciones), new { id = transaccion.TransaccionId }, resultDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> TransaccionUpdate(int id, UpdateTransaccionDto dto)
    {
        var transaccion = await _context.Transacciones.FindAsync(id);

        if (transaccion == null)
        {
            return NotFound();
        }

        transaccion.Monto = dto.Monto;
        transaccion.Descripcion = dto.Descripcion;
        transaccion.Estado = dto.Estado;
        transaccion.TipoTransaccion = dto.TipoTransaccion;
        transaccion.CuentaOrigenId = dto.CuentaOrigenId;
        transaccion.CuentaDestinoId = dto.CuentaDestinoId;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Transacciones.Any(t => t.TransaccionId == id))
                return NotFound();

            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTransaccion(int id)
    {
        var transaccion = await _context.Transacciones.FindAsync(id);

        if (transaccion == null)
        {
            return NotFound();
        }

        _context.Transacciones.Remove(transaccion);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("porCuenta/{cuentaId}")]
    public async Task<IActionResult> GetTransaccionesPorCuenta(int cuentaId)
    {
        var transacciones = await _context.Transacciones
            .Include(t => t.CuentaOrigen).ThenInclude(c => c.Usuario)
            .Include(t => t.CuentaDestino).ThenInclude(c => c.Usuario)
            .Where(t => t.CuentaOrigenId == cuentaId || t.CuentaDestinoId == cuentaId)
            .OrderByDescending(t => t.Fecha)
            .Select(t => new TransaccionNombreDTO
            {
                TransaccionId = t.TransaccionId,
                Monto = t.Monto,
                Fecha = t.Fecha,
                Descripcion = t.Descripcion,
                Estado = t.Estado,
                TipoTransaccion = t.TipoTransaccion,
                CuentaOrigenId = t.CuentaOrigenId,
                CuentaDestinoId = t.CuentaDestinoId,
                NombreOrigen = t.CuentaOrigen != null ? t.CuentaOrigen.Usuario.Nombre : null,
                ApellidoOrigen = t.CuentaOrigen != null ? t.CuentaOrigen.Usuario.Apellido : null,
                NombreDestino = t.CuentaDestino != null ? t.CuentaDestino.Usuario.Nombre : null,
                ApellidoDestino = t.CuentaDestino != null ? t.CuentaDestino.Usuario.Apellido : null
            })
            .ToListAsync();

        return Ok(transacciones);
    }
}