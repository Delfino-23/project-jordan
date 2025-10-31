const video = document.getElementById("meuVideo");
// Definir início e fim
const inicio = 0; // começa no segundo 0
const fim = 30;    // termina no segundo 30 (30s depois)

video.addEventListener("loadedmetadata", () => {
  video.currentTime = inicio; // começa no ponto definido
});

video.addEventListener("timeupdate", () => {
  if (video.currentTime >= fim) {
    video.currentTime = inicio;  // volta para o início
    video.play();                // continua reproduzindo
  }
});

// Máscara para telefone
document.getElementById('telefone').addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length >= 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
  if (v.length >= 9) v = v.slice(0, 9) + '-' + v.slice(9);
  e.target.value = v;
});

// Máscara para CPF
  document.getElementById('cpf').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
  });

  // Validação de CPF
function validaCPF(cpf) {
  cpf = cpf.replace(/[.\-]/g, "");
  if (cpf.length !== 11) return false; // apenas valida tamanho

  let digits = cpf.split("").map(Number);

  let a = digits.slice(0, 9);
  let b1_in = digits[9];
  let b2_in = digits[10];

  // cálculo do b1
  let s1 = 0;
  for (let i = 0; i < 9; i++) {
    s1 += a[i] * (i + 1);
  }
  let b1 = s1 % 11;
  if (b1 === 10) b1 = 0;

  // cálculo do b2
  let s2 = 0;
  for (let i = 0; i < 9; i++) {
    s2 += a[i] * (9 - i);
  }
  let b2 = s2 % 11;
  if (b2 === 10) b2 = 0;

  // validação
  return b1 === b1_in && b2 === b2_in;
}

// Máscara para CPF
document.getElementById('cpf').addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = v;
});

// Validação Bootstrap + CPF
document.getElementById('formAulaExperimental').addEventListener('submit', function(event) {
  const cpfInput = document.getElementById('cpf');
  const cpfValue = cpfInput.value;

  if (!validaCPF(cpfValue)) {
    cpfInput.classList.add('is-invalid');
    event.preventDefault();
    event.stopPropagation();
  } else {
    cpfInput.classList.remove('is-invalid');
  }

  if (!this.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  this.classList.add('was-validated');
});

// Feedback com Toast para agendamento de aula experimental
document.getElementById('formAulaExperimental').addEventListener('submit', function(event) {
  event.preventDefault();
  event.stopPropagation();

  // Aqui você pode validar o CPF ou outros campos
  if (this.checkValidity()) {
    document.getElementById('agendarToastMsg').textContent = 'Aula experimental agendada com sucesso!';
    const toastEl = document.getElementById('agendarToast');
    toastEl.classList.remove('text-bg-danger');
    toastEl.classList.add('text-bg-primary');
    bootstrap.Toast.getOrCreateInstance(toastEl).show();
    this.reset();
    this.classList.remove('was-validated');
  } else {
    document.getElementById('agendarToastMsg').textContent = 'Preencha corretamente os campos obrigatórios!';
    const toastEl = document.getElementById('agendarToast');
    toastEl.classList.remove('text-bg-primary');
    toastEl.classList.add('text-bg-danger');
    bootstrap.Toast.getOrCreateInstance(toastEl).show();
    this.classList.add('was-validated');
  }
});