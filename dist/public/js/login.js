const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/login/validar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataObject),
    });

    const data = await response.json();

    if (response.status === 200) {
      Swal.fire({
        title: "Sucesso!",
        text: `Login realizado com sucesso: ${data.usuario.nome}`,
        icon: "success",
        confirmButtonText: "OK",
      });
      form.reset();
    } else {
      Swal.fire({
        title: "Erro!",
        text: data.error || "Erro ao criar usuário.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } catch (err) {
    Swal.fire({
      title: "Erro!",
      text: `Erro: ${err.message}`,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
});
