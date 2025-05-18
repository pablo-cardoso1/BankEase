using BankEase.Api.Models;
using BankEase.Api.Services;
using BankEase.Api.Dtos;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BankEase.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;
        private readonly IConfiguration _configuration;

        public UsuarioController(UsuarioService usuarioService, IConfiguration configuration)
        {
            _usuarioService = usuarioService;
            _configuration = configuration;
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

            // Gera o token JWT
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Cpf),
                new Claim(JwtRegisteredClaimNames.UniqueName, usuario.Nome),
                new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
                new Claim("id", usuario.Id.ToString())
            };
            var expires = DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpireMinutes"]));
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { token = tokenString, usuario = new { usuario.Id, usuario.Nome, usuario.Email, usuario.Cpf } });
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
