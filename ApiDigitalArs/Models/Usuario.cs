public class Usuario{
    public int UsuarioId { get; set; }
    public string Nombre { get; set; } = null!;
    public string Apellido { get; set; } = null!;
    public string Dni { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Contraseña { get; set; } = null!;
    // FK a Rol
    public int RolId { get; set; }
    public Rol Rol { get; set; } = null!;

    // Relación: Un usuario tiene muchas cuentas
    public ICollection<Cuenta> Cuentas { get; set; } = new List<Cuenta>();
}