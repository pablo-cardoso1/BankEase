using BankEase.Api.Dtos;
using BankEase.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BankEase.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContaController : ControllerBase
    {
        private readonly ContaService _contaService;

        public ContaController(ContaService contaService)
        {
            _contaService = contaService;
        }

        // GET: api/conta/saldo/{cpf}
        [HttpGet("saldo/{cpf}")]
        public async Task<IActionResult> ConsultarSaldo(string cpf)
        {
            var saldo = await _contaService.ConsultarSaldoAsync(cpf);
            if (saldo == null) return NotFound("Usuário não encontrado");
            return Ok(new { saldo });
        }

        // POST: api/conta/deposito
        [HttpPost("deposito")]
        public async Task<IActionResult> Deposito([FromBody] DepositoDto dto)
        {
            var sucesso = await _contaService.RealizarDepositoAsync(dto.Cpf, dto.Valor);
            if (!sucesso) return BadRequest("Depósito inválido");
            return Ok("Depósito realizado com sucesso");
        }

        // POST: api/conta/transferencia
        [HttpPost("transferencia")]
        public async Task<IActionResult> Transferencia([FromBody] TransferenciaDto dto)
        {
            var sucesso = await _contaService.RealizarTransferenciaAsync(dto.CpfOrigem, dto.CpfDestino, dto.Valor);
            if (!sucesso) return BadRequest("Transferência inválida");
            return Ok("Transferência realizada com sucesso");
        }

        // GET: api/conta/extrato/{cpf}
        [HttpGet("extrato/{cpf}")]
        public async Task<IActionResult> Extrato(string cpf)
        {
            var transacoes = await _contaService.ObterExtratoAsync(cpf);
            var extrato = transacoes.Select(t => new ExtratoDto
            {
                Data = t.Data,
                Tipo = t.Tipo,
                Valor = t.Valor,
                Descricao = t.Tipo switch
                {
                    "deposito" => "Depósito realizado",
                    "enviada" => $"Transferência enviada para CPF {t.Destinatario}",
                    "recebida" => $"Transferência recebida de CPF {t.Remetente}",
                    _ => "Transação"
                },
                Destinatario = t.Destinatario,
                Remetente = t.Remetente
            }).ToList();
            return Ok(extrato);
        }
    }
}
