export function formatCPF(value: string) {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

export function formatCEP(value: string) {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
}