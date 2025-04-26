using System;

namespace BankEase.Api.Dtos
{
    public class ExtratoDto
    {
        public DateTime Data { get; set; }
        public string Tipo { get; set; }
        public decimal Valor { get; set; }
        public string? Descricao { get; set; }
        public string? Destinatario { get; set; }
        public string? Remetente { get; set; }
    }
}
