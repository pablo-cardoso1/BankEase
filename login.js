// Função de login
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const cpf = document.getElementById("login-cpf").value;
    const senha = document.getElementById("login-senha").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
    const usuario = usuarios[cpf];

    if (usuario && usuario.senha === senha) {
        alert("Login bem-sucedido!");
        localStorage.setItem("usuarioLogado", cpf); 
        window.location.href = "dashboard.html";
    } else {
        alert("CPF ou senha incorretos.");
    }
});
