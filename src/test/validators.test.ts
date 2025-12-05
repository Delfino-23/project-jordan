import { validarCamposObrigatorios, validarEmail, validarTelefone, validarCPF } from "../utils/validators.js";

describe("Testes de Validadores", () => {
  describe("validarCamposObrigatorios", () => {
    test("Deve retornar null quando todos os campos estão preenchidos", () => {
      const campos = { nome: "João", email: "joao@email.com", tel: "11999999999" };
      const resultado = validarCamposObrigatorios(campos, ['nome', 'email', 'tel']);
      expect(resultado).toBeNull();
    });

    test("Deve retornar erro quando um campo está vazio", () => {
      const campos = { nome: "João", email: "", tel: "11999999999" };
      const resultado = validarCamposObrigatorios(campos, ['nome', 'email', 'tel']);
      expect(resultado).toBe("Preencha todos os campos!");
    });

    test("Deve retornar erro quando um campo não existe", () => {
      const campos = { nome: "João", tel: "11999999999" };
      const resultado = validarCamposObrigatorios(campos, ['nome', 'email', 'tel']);
      expect(resultado).toBe("Preencha todos os campos!");
    });

    test("Deve retornar erro quando campo é apenas espaços em branco", () => {
      const campos = { nome: "   ", email: "joao@email.com", tel: "11999999999" };
      const resultado = validarCamposObrigatorios(campos, ['nome', 'email', 'tel']);
      expect(resultado).toBe("Preencha todos os campos!");
    });
  });

  describe("validarEmail", () => {
    test("Deve validar email correto", () => {
      expect(validarEmail("usuario@email.com")).toBe(true);
    });

    test("Deve rejeitar email sem @", () => {
      expect(validarEmail("usuarioemail.com")).toBe(false);
    });

    test("Deve rejeitar email sem domínio", () => {
      expect(validarEmail("usuario@")).toBe(false);
    });

    test("Deve rejeitar email com espaços", () => {
      expect(validarEmail("usuario @email.com")).toBe(false);
    });
  });

  describe("validarTelefone", () => {
    test("Deve validar telefone com 9 dígitos", () => {
      expect(validarTelefone("(11) 99999-9999")).toBe(true);
    });

    test("Deve validar telefone com 8 dígitos", () => {
      expect(validarTelefone("(11) 3333-3333")).toBe(true);
    });

    test("Deve rejeitar telefone sem parênteses", () => {
      expect(validarTelefone("11 99999-9999")).toBe(false);
    });

    test("Deve rejeitar telefone com formato incorreto", () => {
      expect(validarTelefone("11999999999")).toBe(false);
    });
  });

  describe("validarCPF", () => {
    test("Deve validar CPF correto", () => {
      expect(validarCPF("123.456.789-10")).toBe(true);
    });

    test("Deve rejeitar CPF sem pontuação", () => {
      expect(validarCPF("12345678910")).toBe(false);
    });

    test("Deve rejeitar CPF com formato incorreto", () => {
      expect(validarCPF("123-456-789.10")).toBe(false);
    });

    test("Deve rejeitar CPF incompleto", () => {
      expect(validarCPF("123.456.789")).toBe(false);
    });
  });
});
