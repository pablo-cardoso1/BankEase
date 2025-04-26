using BankEase.Api.Models;
using BankEase.Api.Services;
using BankEase.Api.Dtos;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;

namespace BankEase.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public UsuarioController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        // POST: api/usuario/cadastro
        [HttpPost("cadastro")]
        public async Task<IActionResult> Cadastro([FromBody] UsuarioCadastroDto dto)
        {
            if (await _usuarioService.CpfExisteAsync(dto.Cpf))
                return BadRequest("CPF já cadastrado");
            if (await _usuarioService.EmailExisteAsync(dto.Email))
                return BadRequest("Email já cadastrado");

            var senhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha);
            var usuario = await _usuarioService.CriarUsuarioAsync(dto.Nome, dto.Email, dto.Cpf, senhaHash);
            return Ok(new { usuario.Id, usuario.Nome, usuario.Email, usuario.Cpf });
        }

        // POST: api/usuario/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDto dto)
        {
            var usuario = await _usuarioService.BuscarPorCpfAsync(dto.Cpf);
            if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash))
                return Unauthorized("CPF ou senha inválidos");

            return Ok(new { usuario.Id, usuario.Nome, usuario.Email, usuario.Cpf });
        }

        // GET: api/usuario/{cpf}
        [HttpGet("{cpf}")]
        public async Task<IActionResult> GetByCpf(string cpf)
        {
            var usuario = await _usuarioService.BuscarPorCpfAsync(cpf);
            if (usuario == null) return NotFound();
            return Ok(new { usuario.Id, usuario.Nome, usuario.Email, usuario.Cpf });
        }
    }
}
