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

    // Redirecionar para a página de login
    window.location.href = "index.html";
});
