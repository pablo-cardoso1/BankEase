// Função de cadastro
document.getElementById("cadastro-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;

    // Armazenando no localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

    if (usuarios[cpf]) {
        alert("Este CPF já está cadastrado.");
    } else {
        usuarios[cpf] = { cpf, senha, saldo: 0, extrato: [] };
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert("Cadastro realizado com sucesso!");
    }
});

// Função de login
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const cpf = document.getElementById("login-cpf").value;
    const senha = document.getElementById("login-senha").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
    const usuario = usuarios[cpf];

    if (usuario && usuario.senha === senha) {
        alert("Login bem-sucedido!");
        localStorage.setItem("usuarioLogado", cpf); // <-- ESSA LINHA É IMPORTANTE!
        window.location.href = "dashboard.html";
    } else {
        alert("CPF ou senha incorretos.");
    }
});

