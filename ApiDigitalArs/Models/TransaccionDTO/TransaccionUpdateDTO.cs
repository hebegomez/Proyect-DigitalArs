public class UpdateTransaccionDto
{
    public decimal Monto { get; set; }
    public string Descripcion { get; set; } = null!;
    public string Estado { get; set; } = null!;
    public string TipoTransaccion { get; set; } = null!;
    public int? CuentaOrigenId { get; set; }
    public int? CuentaDestinoId { get; set; }
}
