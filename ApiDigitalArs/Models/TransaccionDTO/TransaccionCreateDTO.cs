public class TransaccionCreateDTO
{
    public decimal Monto { get; set; }
    public string Descripcion { get; set; } = null!;
    public string TipoTransaccion { get; set; } = null!;
    public int? CuentaOrigenId { get; set; }
    public int? CuentaDestinoId { get; set; }  // opcional, puede omitirse si usas EmailDestino
    public string? EmailDestino { get; set; }  // nuevo campo para transferencia por email
}