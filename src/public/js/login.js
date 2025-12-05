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
      // Armazenar token no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      Swal.fire({
        title: "Sucesso!",
        text: `Login realizado com sucesso: ${data.usuario.nome}`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirecionar para página principal após confirmar
        window.location.href = "/";
      });
      
      form.reset();
    } else {
      Swal.fire({
        title: "Erro!",
        text: data.error || "Erro ao realizar login.",
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
