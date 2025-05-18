document.addEventListener("DOMContentLoaded", () => {
  const cpfLogado = localStorage.getItem("usuarioLogado");
  const jwtToken = localStorage.getItem("jwtToken");
  if (!cpfLogado || !jwtToken) {
    alert("Você precisa estar logado.");
    window.location.href = "index.html";
    return;
  }

  // --- Elementos do DOM ---
  const userCpfElement = document.getElementById("user-cpf");
  const saldoElement = document.getElementById("saldo");
  const logoutBtn = document.getElementById("logout-btn");
  const transferForm = document.getElementById("transfer-form");
  const destCpfInput = document.getElementById("dest-cpf");
  const transferAmountInput = document.getElementById("transfer-amount");
  const transferFeedbackElement = document.getElementById("transfer-feedback");
  const listaExtratoElement = document.getElementById("lista-extrato");
  const depositForm = document.getElementById("deposit-form");
  const depositAmountInput = document.getElementById("deposit-amount");
  const depositFeedbackElement = document.getElementById("deposit-feedback");

  const API_BASE = "http://localhost:5119/api"; // Ajuste para sua porta/api

  const authHeaders = {
    "Authorization": `Bearer ${jwtToken}`
  };

  const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Busca nome do usuário pelo CPF
  function atualizarNomeUsuario() {
    fetch(`${API_BASE}/usuario/${cpfLogado}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (data && data.nome) {
          userCpfElement.textContent = data.nome;
        } else {
          userCpfElement.textContent = cpfLogado;
        }
      })
      .catch(() => {
        userCpfElement.textContent = cpfLogado;
      });
  }

  atualizarNomeUsuario();

  // Atualiza saldo na tela
  function atualizarSaldo() {
    fetch(`${API_BASE}/conta/saldo/${cpfLogado}`, {
      headers: authHeaders
    })
      .then(r => r.json())
      .then(data => saldoElement.textContent = formatCurrency(data.saldo))
      .catch(() => saldoElement.textContent = formatCurrency(0));
  }

  // Atualiza extrato na tela
  function atualizarExtrato() {
    fetch(`${API_BASE}/conta/extrato/${cpfLogado}`, {
      headers: authHeaders
    })
      .then(r => r.json())
      .then(displayExtrato)
      .catch(() => displayExtrato([]));
  }

  // Exibe extrato
  function displayExtrato(extrato) {
    listaExtratoElement.innerHTML = '';
    if (!extrato || extrato.length === 0) {
      listaExtratoElement.innerHTML = '<li>Nenhuma transação encontrada.</li>';
      return;
    }
    extrato.sort((a, b) => new Date(b.data) - new Date(a.data));
    extrato.forEach(transacao => {
      const li = document.createElement('li');
      const valorFormatado = formatCurrency(transacao.valor);
      const dataFormatada = formatDate(transacao.data);
      let descricao = '';
      let classeTipo = '';
      if (transacao.tipo === 'enviada') {
        descricao = `Transferência enviada para CPF ${transacao.destinatario || ''}`;
        classeTipo = 'transacao-enviada';
      } else if (transacao.tipo === 'recebida') {
        descricao = `Transferência recebida de CPF ${transacao.remetente || ''}`;
        classeTipo = 'transacao-recebida';
      } else if (transacao.tipo === 'deposito') {
        descricao = `Depósito realizado`;
        classeTipo = 'transacao-recebida';
      } else {
        descricao = `Transação desconhecida`;
      }
      li.classList.add(classeTipo);
      li.innerHTML = `
        <span class="descricao">${descricao}</span>
        <span class="valor">${valorFormatado}</span>
        <span class="data">${dataFormatada}</span>
      `;
      listaExtratoElement.appendChild(li);
    });
  }

  // Carrega saldo e extrato iniciais
  atualizarSaldo();
  atualizarExtrato();

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("jwtToken");
    window.location.href = "index.html";
  });

  // Depósito
  depositForm.addEventListener("submit", (e) => {
    e.preventDefault();
    depositFeedbackElement.textContent = '';
    const amount = parseFloat(depositAmountInput.value);
    if (isNaN(amount) || amount <= 0) {
      depositFeedbackElement.textContent = "Valor do depósito inválido.";
      depositFeedbackElement.style.color = 'red';
      return;
    }
    fetch(`${API_BASE}/conta/deposito`, {
      method: 'POST',
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ cpf: cpfLogado, valor: amount })
    })
      .then(r => {
        if (!r.ok) throw new Error('Erro ao depositar');
        return r.text();
      })
      .then(() => {
        depositFeedbackElement.textContent = "Depósito realizado com sucesso!";
        depositFeedbackElement.style.color = 'green';
        atualizarSaldo();
        atualizarExtrato();
        depositAmountInput.value = '';
      })
      .catch(() => {
        depositFeedbackElement.textContent = "Erro ao realizar depósito.";
        depositFeedbackElement.style.color = 'red';
      });
  });

  // Transferência
  transferForm.addEventListener("submit", (e) => {
    e.preventDefault();
    transferFeedbackElement.textContent = '';
    const destCpf = destCpfInput.value;
    const amount = parseFloat(transferAmountInput.value);
    if (destCpf === cpfLogado) {
      transferFeedbackElement.textContent = "Você não pode transferir para si mesmo.";
      transferFeedbackElement.style.color = 'red';
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      transferFeedbackElement.textContent = "Valor da transferência inválido.";
      transferFeedbackElement.style.color = 'red';
      return;
    }
    fetch(`${API_BASE}/conta/transferencia`, {
      method: 'POST',
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ cpfOrigem: cpfLogado, cpfDestino: destCpf, valor: amount })
    })
      .then(r => {
        if (!r.ok) throw new Error('Erro ao transferir');
        return r.text();
      })
      .then(() => {
        transferFeedbackElement.textContent = "Transferência realizada com sucesso!";
        transferFeedbackElement.style.color = 'green';
        atualizarSaldo();
        atualizarExtrato();
        destCpfInput.value = '';
        transferAmountInput.value = '';
      })
      .catch(() => {
        transferFeedbackElement.textContent = "Erro ao realizar transferência. Verifique saldo e CPF.";
        transferFeedbackElement.style.color = 'red';
      });
  });
});
