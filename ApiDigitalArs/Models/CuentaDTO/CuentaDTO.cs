public class CuentaDto
{
    public int CuentaId { get; set; }
    public int UsuarioId { get; set; }
    public string Moneda { get; set; } = null!;
    public decimal Saldo { get; set; }
    public DateTime FechaCreacion { get; set; }
}
