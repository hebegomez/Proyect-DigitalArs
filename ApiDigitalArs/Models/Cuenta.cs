public class Cuenta
{
    public int CuentaId { get; set; }
    public int UsuarioId { get; set; }
    public string Moneda { get; set; } = null!;
    public decimal Saldo { get; set; }
    public DateTime FechaCreacion { get; set; }
    
    // Navegación
    public Usuario Usuario { get; set; } = null!;

    // Relación con transacciones donde esta cuenta es origen o destino
    public ICollection<Transaccion> TransaccionesOrigen { get; set; } = new List<Transaccion>();
    public ICollection<Transaccion> TransaccionesDestino { get; set; } = new List<Transaccion>();
}