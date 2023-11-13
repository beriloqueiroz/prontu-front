
export function isValidCPF(cpf: string): boolean {
  // Remover caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, '');

  // Verificar se o CPF possui 11 dígitos
  if (cpfLimpo.length !== 11) {
    return false;
  }

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }

  // Calcular o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i), 10) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpfLimpo.charAt(9), 10)) {
    return false;
  }

  // Calcular o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i), 10) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpfLimpo.charAt(10), 10)) {
    return false;
  }

  return true;
}

export function isValidExpirationDate(str: string) {
  if (str.includes('/')) {
    if (str.length !== 5) return false;
    const arr = str.split('/');
    const month = arr[0];
    if (Number(month) > 12) return false;
    const year = arr[1];
    const nowYear = Number((new Date()).getFullYear().toString().substring(2, 4));
    const nowMonth = (new Date()).getMonth();
    if (Number(year) === nowYear) {
      if (Number(month) < nowMonth) return false;
    }
    if (Number(year) < nowYear) return false;
    return true;
  }
  if (str.length !== 4) return false;
  const month = str.substring(0, 2);
  if (Number(month) > 12) return false;
  const year = str.substring(2, 4);
  const nowYear = Number((new Date()).getFullYear().toString().substring(2, 4));
  const nowMonth = (new Date()).getMonth();
  if (Number(year) === nowYear) {
    if (Number(month) < nowMonth) return false;
  }
  if (Number(year) < nowYear) return false;
  return true;
}

export function isValidPassword(password: string): { success: boolean, errors: string } {
  const errors: string[] = [];
  const regexLetterLow = new RegExp(/(?=.*[a-z])/g);
  if (!regexLetterLow.test(password)) errors.push("É preciso ter ao menos uma letra minúscula");
  const regexLetterHigh = new RegExp(/(?=.*[A-Z])/g);
  if (!regexLetterHigh.test(password)) errors.push("É preciso ter ao menos uma letra maiúscula");
  const regexNumber = new RegExp(/(?=.*[0-9])/g);
  if (!regexNumber.test(password)) errors.push("É preciso ter ao menos um número");
  const regexLength = new RegExp(/(?=.{8,})/g);
  if (!regexLength.test(password)) errors.push("É preciso ter ao menos 8 caracteres");
  const regexSpecial = new RegExp(/(?=.*[^A-Za-z0-9])/g);
  if (!regexSpecial.test(password)) errors.push("É preciso ter ao menos 1 caractere especial, tal como #@!$%¨&");
  return { success: errors.length === 0, errors: errors.join(", ") };
}

export function currencyToNumber(currency: string): number {
  return Number(currency.replaceAll("R$ ", "").replaceAll(",00", ""));
}