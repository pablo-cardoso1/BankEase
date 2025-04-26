namespace BankEase.Api.Dtos
{
    public class TransferenciaDto
    {
        public string CpfOrigem { get; set; }
        public string CpfDestino { get; set; }
        public decimal Valor { get; set; }
    }
}
