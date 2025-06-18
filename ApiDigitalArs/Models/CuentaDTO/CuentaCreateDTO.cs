public class CreateCuentaDto
{
    public int UsuarioId { get; set; }
    public string Moneda { get; set; } = null!;
    public decimal Saldo { get; set; }
}
