using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BankEase.Api.Models
{
    public class Usuario
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required] 
        public string Nome { get; set; }
        
        [Required] 
        public string Email { get; set; }

        [Required]
        [MaxLength(11)]
        public string Cpf { get; set; }

        [Required]
        public string SenhaHash { get; set; }

        public decimal Saldo { get; set; } = 0;

        public List<Transacao> Extrato { get; set; } = new();
    }
}