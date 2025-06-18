public class CreateUsuarioDto
{
    public string Nombre { get; set; } = null!;
    public string Apellido { get; set; } = null!;
    public string Dni { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Contrasenia { get; set; } = null!;
    public int RolId { get; set; }
}
