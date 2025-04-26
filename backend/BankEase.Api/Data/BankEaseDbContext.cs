using BankEase.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BankEase.Api.Data
{
    public class BankEaseDbContext : DbContext
    {
        public BankEaseDbContext(DbContextOptions<BankEaseDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relacionamento: Usuario tem muitas Transacoes
            modelBuilder.Entity<Usuario>()
                .HasMany(u => u.Extrato)
                .WithOne(t => t.Usuario)
                .HasForeignKey(t => t.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            // CPF único
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Cpf)
                .IsUnique();
        }
    }
}
