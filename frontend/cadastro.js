// Função de cadastro
document.getElementById("cadastro-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;

    fetch("http://localhost:5119/api/usuario/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, cpf, senha })
    })
    .then(r => {
        if (!r.ok) throw new Error("Erro no cadastro");
        return r.json();
    })
    .then(() => {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "index.html";
    })
    .catch(() => {
        alert("Erro ao cadastrar. Verifique os dados ou se o CPF já está cadastrado.");
    });
});
