using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BankEase.Api.Models
{
    public class Transacao
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Tipo { get; set; }

        [Required]
        public decimal Valor { get; set; }

        public DateTime Data { get; set; } = DateTime.Now;

        // Relacionamento com Usuario
        [ForeignKey("Usuario")]
        public Guid UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        public string? Destinatario { get; set; }
        public string? Remetente { get; set; }
    }
}