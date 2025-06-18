using Microsoft.EntityFrameworkCore;

public class ApiDigitalDbContext : DbContext
{
    public ApiDigitalDbContext(DbContextOptions<ApiDigitalDbContext> options) : base(options)
    {
    }

    public DbSet<Cuenta> Cuentas { get; set; } = null!;
    public DbSet<Rol> Roles { get; set; } = null!;
    public DbSet<Transaccion> Transacciones { get; set; } = null!;
    public DbSet<Usuario> Usuarios { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder) 
    {
        // Configuración para Rol
        modelBuilder.Entity<Rol>(entity =>
        {
            entity.Property(e => e.RolNombre)
                  .HasColumnType("TEXT")   // Cambiar nvarchar(max) a TEXT para SQLite
                  .IsRequired();
        });

        // Conversión para decimal a double en SQLite
        modelBuilder.Entity<Cuenta>()
            .Property(c => c.Saldo)
            .HasConversion<double>();

        modelBuilder.Entity<Transaccion>()
            .Property(t => t.Monto)
            .HasConversion<double>();

        // Relación Cuenta - Usuario
        modelBuilder.Entity<Cuenta>()
            .HasOne(c => c.Usuario)
            .WithMany(u => u.Cuentas)
            .HasForeignKey(c => c.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relaciones Transaccion - Cuenta origen/destino
        modelBuilder.Entity<Transaccion>()
            .HasOne(t => t.CuentaOrigen)
            .WithMany(c => c.TransaccionesOrigen)
            .HasForeignKey(t => t.CuentaOrigenId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Transaccion>()
            .HasOne(t => t.CuentaDestino)
            .WithMany(c => c.TransaccionesDestino)
            .HasForeignKey(t => t.CuentaDestinoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}