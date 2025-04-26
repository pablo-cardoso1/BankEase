using BankEase.Api.Data;
using BankEase.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BankEase.Api.Services
{
    public class UsuarioService
    {
        private readonly BankEaseDbContext _context;
        public UsuarioService(BankEaseDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CpfExisteAsync(string cpf)
            => await _context.Usuarios.AnyAsync(u => u.Cpf == cpf);

        public async Task<bool> EmailExisteAsync(string email)
            => await _context.Usuarios.AnyAsync(u => u.Email == email);

        public async Task<Usuario> CriarUsuarioAsync(string nome, string email, string cpf, string senhaHash)
        {
            var usuario = new Usuario
            {
                Nome = nome,
                Email = email,
                Cpf = cpf,
                SenhaHash = senhaHash
            };
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<Usuario> BuscarPorCpfAsync(string cpf)
            => await _context.Usuarios.FirstOrDefaultAsync(u => u.Cpf == cpf);
    }
}
