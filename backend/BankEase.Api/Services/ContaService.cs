using BankEase.Api.Data;
using BankEase.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BankEase.Api.Services
{
    public class ContaService
    {
        private readonly BankEaseDbContext _context;
        public ContaService(BankEaseDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> BuscarUsuarioPorCpfAsync(string cpf)
            => await _context.Usuarios.Include(u => u.Extrato).FirstOrDefaultAsync(u => u.Cpf == cpf);

        public async Task<decimal?> ConsultarSaldoAsync(string cpf)
        {
            var usuario = await BuscarUsuarioPorCpfAsync(cpf);
            return usuario?.Saldo;
        }

        public async Task<bool> RealizarDepositoAsync(string cpf, decimal valor)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Extrato)
                .FirstOrDefaultAsync(u => u.Cpf == cpf);

            if (usuario == null)
                return false;
            if (valor <= 0)
                return false;

            usuario.Saldo += valor;
            var transacao = new Transacao
            {
                Tipo = "deposito",
                Valor = valor,
                Data = DateTime.Now,
                Destinatario = cpf,
                UsuarioId = usuario.Id
            };
            _context.Transacoes.Add(transacao);
            usuario.Extrato.Add(transacao); // opcional

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> RealizarTransferenciaAsync(string cpfOrigem, string cpfDestino, decimal valor)
        {
            if (valor <= 0 || cpfOrigem == cpfDestino)
                return false;
            var origem = await BuscarUsuarioPorCpfAsync(cpfOrigem);
            var destino = await BuscarUsuarioPorCpfAsync(cpfDestino);
            if (origem == null || destino == null || origem.Saldo < valor)
                return false;
            origem.Saldo -= valor;
            destino.Saldo += valor;

            var transacaoEnviada = new Transacao {
                Tipo = "enviada",
                Valor = valor,
                Data = DateTime.Now,
                Destinatario = cpfDestino,
                UsuarioId = origem.Id
            };
            var transacaoRecebida = new Transacao {
                Tipo = "recebida",
                Valor = valor,
                Data = DateTime.Now,
                Remetente = cpfOrigem,
                UsuarioId = destino.Id
            };
            _context.Transacoes.Add(transacaoEnviada);
            _context.Transacoes.Add(transacaoRecebida);
            origem.Extrato.Add(transacaoEnviada); // opcional
            destino.Extrato.Add(transacaoRecebida); // opcional

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<List<Transacao>> ObterExtratoAsync(string cpf)
        {
            var usuario = await BuscarUsuarioPorCpfAsync(cpf);
            return usuario?.Extrato.OrderByDescending(t => t.Data).ToList() ?? new List<Transacao>();
        }
    }
}
