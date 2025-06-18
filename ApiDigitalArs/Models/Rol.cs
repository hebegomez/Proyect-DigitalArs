public class Rol
{
    public int RolId { get; set; }
    public string RolNombre { get; set; } = null!;
    
    // Relación: Un rol tiene muchos usuarios
    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}