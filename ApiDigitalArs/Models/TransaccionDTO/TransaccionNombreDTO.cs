public class TransaccionNombreDTO
{
    public int TransaccionId { get; set; }
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public string Descripcion { get; set; } = null!;
    public string Estado { get; set; } = null!;
    public string TipoTransaccion { get; set; } = null!;
    public int? CuentaOrigenId { get; set; }
    public int? CuentaDestinoId { get; set; }

    public string? NombreOrigen { get; set; }
    public string? ApellidoOrigen { get; set; }
    public string? NombreDestino { get; set; }
    public string? ApellidoDestino { get; set; }
}