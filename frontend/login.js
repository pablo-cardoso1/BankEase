// Função de login
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const cpf = document.getElementById("login-cpf").value;
    const senha = document.getElementById("login-senha").value;

    fetch("http://localhost:5119/api/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha })
    })
    .then(r => {
        if (!r.ok) throw new Error("Login inválido");
        return r.json();
    })
    .then((data) => {
        localStorage.setItem("usuarioLogado", cpf);
        localStorage.setItem("jwtToken", data.token);
        window.location.href = "dashboard.html";
    })
    .catch(() => {
        alert("CPF ou senha incorretos.");
    });
});
