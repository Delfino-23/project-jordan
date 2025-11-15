const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/register/salvar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataObject),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        title: "Sucesso!",
        text: data.message,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Erro!",
        text: data.error,
        icon: "error",
      });
    }
  } catch (err) {
    Swal.fire({
      title: "Erro!",
      text: `Erro: ${err.message}`,
      icon: "error",
    });
  }
});
