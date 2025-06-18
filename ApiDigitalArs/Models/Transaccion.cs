public class Transaccion
{
    public int TransaccionId { get; set; }
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public string Descripcion { get; set; }
    public string Estado { get; set; }
    public string TipoTransaccion { get; set; }

    public int? CuentaOrigenId { get; set; }
    public Cuenta CuentaOrigen { get; set; }

    public int? CuentaDestinoId { get; set; }
    public Cuenta CuentaDestino { get; set; }
}