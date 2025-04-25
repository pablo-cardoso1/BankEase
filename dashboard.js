document.addEventListener("DOMContentLoaded", () => {
  const cpfLogado = localStorage.getItem("usuarioLogado");

  if (!cpfLogado) {
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
  const depositForm = document.getElementById("deposit-form"); // <-- Adicionado
  const depositAmountInput = document.getElementById("deposit-amount"); // <-- Adicionado
  const depositFeedbackElement = document.getElementById("deposit-feedback"); // <-- Adicionado


  // --- Funções Auxiliares ---
  const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || {};
  const saveUsuarios = (usuarios) => localStorage.setItem("usuarios", JSON.stringify(usuarios));
  const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    // Formato DD/MM/AAAA HH:MM
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  // --- Função para Atualizar Saldo na Tela ---
  const atualizarSaldoTela = (saldo) => {
    saldoElement.textContent = formatCurrency(saldo);
  };

  // --- Função para Exibir Extrato ---
  const displayExtrato = (extrato) => {
    listaExtratoElement.innerHTML = ''; // Limpa a lista atual

    if (!extrato || extrato.length === 0) {
      listaExtratoElement.innerHTML = '<li>Nenhuma transação encontrada.</li>';
      return;
    }

    // Ordena por data, mais recente primeiro
    extrato.sort((a, b) => b.data - a.data);

    extrato.forEach(transacao => {
      const li = document.createElement('li');
      const valorFormatado = formatCurrency(transacao.valor);
      const dataFormatada = formatDate(transacao.data);

      let descricao = '';
      let classeTipo = '';

      if (transacao.tipo === 'enviada') {
        descricao = `Transferência enviada para CPF ${transacao.destinatario || transacao.remetente}`; // Ajuste para compatibilidade
        classeTipo = 'transacao-enviada';
      } else if (transacao.tipo === 'recebida') {
        descricao = `Transferência recebida de CPF ${transacao.remetente || transacao.destinatario}`; // Ajuste para compatibilidade
        classeTipo = 'transacao-recebida';
      } else if (transacao.tipo === 'deposito') { // <-- Bloco adicionado/modificado
        descricao = `Depósito realizado`;
        classeTipo = 'transacao-recebida'; // Usar a mesma classe/cor de entrada
      } else {
        descricao = `Transação desconhecida`; // Caso base
      }

      li.classList.add(classeTipo);
      li.innerHTML = `
              <span class="descricao">${descricao}</span>
              <span class="valor">${valorFormatado}</span>
              <span class="data">${dataFormatada}</span>
          `;
      listaExtratoElement.appendChild(li);
    });
  };

  // --- Carregamento Inicial ---
  let usuarios = getUsuarios();
  let usuarioLogado = usuarios[cpfLogado];

  if (!usuarioLogado) {
    alert("Erro ao carregar dados do usuário.");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "landing.html";
    return;
  }

  userCpfElement.textContent = cpfLogado;
  atualizarSaldoTela(usuarioLogado.saldo);
  displayExtrato(usuarioLogado.extrato); // Exibe o extrato inicial

  // --- Event Listeners ---
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
  });

  transferForm.addEventListener("submit", (e) => {
    e.preventDefault();
    transferFeedbackElement.textContent = ''; // Limpa feedback anterior

    const destCpf = destCpfInput.value;
    const amount = parseFloat(transferAmountInput.value);

    // Re-ler os dados mais recentes antes de transacionar
    usuarios = getUsuarios();
    usuarioLogado = usuarios[cpfLogado];
    const destinatario = usuarios[destCpf];

    // Validações
    if (destCpf === cpfLogado) {
      transferFeedbackElement.textContent = "Você não pode transferir para si mesmo.";
      transferFeedbackElement.style.color = 'red';
      return;
    }
    if (!destinatario) {
      transferFeedbackElement.textContent = "CPF do destinatário não encontrado.";
      transferFeedbackElement.style.color = 'red';
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      transferFeedbackElement.textContent = "Valor da transferência inválido.";
      transferFeedbackElement.style.color = 'red';
      return;
    }
    if (usuarioLogado.saldo < amount) {
      transferFeedbackElement.textContent = "Saldo insuficiente.";
      transferFeedbackElement.style.color = 'red';
      return;
    }

    // --- Realizar a Transferência ---
    const timestamp = Date.now();

    // Atualizar saldo do remetente
    usuarioLogado.saldo -= amount;
    // Adicionar transação ao extrato do remetente
    if (!usuarioLogado.extrato) usuarioLogado.extrato = []; // Garante que extrato exista
    usuarioLogado.extrato.push({
      tipo: 'enviada',
      valor: amount,
      destinatario: destCpf,
      data: timestamp
    });

    // Atualizar saldo do destinatário
    destinatario.saldo += amount;
    // Adicionar transação ao extrato do destinatário
    if (!destinatario.extrato) destinatario.extrato = []; // Garante que extrato exista
    destinatario.extrato.push({
      tipo: 'recebida',
      valor: amount,
      remetente: cpfLogado,
      data: timestamp
    });

    // Salvar alterações no localStorage
    saveUsuarios(usuarios);

    // Atualizar a interface
    atualizarSaldoTela(usuarioLogado.saldo);
    displayExtrato(usuarioLogado.extrato);

    // Feedback de sucesso
    transferFeedbackElement.textContent = "Transferência realizada com sucesso!";
    transferFeedbackElement.style.color = 'green';

    // Limpar formulário
    destCpfInput.value = '';
    transferAmountInput.value = '';
  });

  // --- Event Listener para Depósito --- (Bloco inteiro adicionado)
  depositForm.addEventListener("submit", (e) => {
    e.preventDefault();
    depositFeedbackElement.textContent = ''; // Limpa feedback anterior

    const amount = parseFloat(depositAmountInput.value);

    // Validação
    if (isNaN(amount) || amount <= 0) {
      depositFeedbackElement.textContent = "Valor do depósito inválido.";
      depositFeedbackElement.style.color = 'red';
      return;
    }

    // --- Realizar o Depósito ---
    // Re-ler os dados mais recentes antes de transacionar
    usuarios = getUsuarios();
    usuarioLogado = usuarios[cpfLogado];

    const timestamp = Date.now();

    // Atualizar saldo
    usuarioLogado.saldo += amount;

    // Adicionar transação ao extrato
    if (!usuarioLogado.extrato) usuarioLogado.extrato = []; // Garante que extrato exista
    usuarioLogado.extrato.push({
      tipo: 'deposito', // <-- Novo tipo
      valor: amount,
      data: timestamp
    });

    // Salvar alterações no localStorage
    saveUsuarios(usuarios);

    // Atualizar a interface
    atualizarSaldoTela(usuarioLogado.saldo);
    displayExtrato(usuarioLogado.extrato); // Atualiza o extrato para incluir o depósito

    // Feedback de sucesso
    depositFeedbackElement.textContent = "Depósito realizado com sucesso!";
    depositFeedbackElement.style.color = 'green';

    // Limpar formulário
    depositAmountInput.value = '';
  });

}); // Fim do DOMContentLoaded
