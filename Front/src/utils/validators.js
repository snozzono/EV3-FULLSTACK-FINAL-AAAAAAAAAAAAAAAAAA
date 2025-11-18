// Valida dominios permitidos en correo
export function isValidEmailDomain(email) {
  const allowed = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
  const match = String(email).toLowerCase().match(/^[^@\s]+@([^@\s]+)$/);
  if (!match) return false;
  const domain = match[1];
  return allowed.includes(domain);
}

// Contraseña entre 4 y 10 caracteres
export function isValidPassword(password) {
  const len = String(password).length;
  return len >= 4 && len <= 10;
}

// Valida RUN/RUT chileno sin puntos ni guión, con DV
export function isValidRun(run) {
  const clean = String(run).trim().toUpperCase();
  if (!/^([0-9]{7,8}[0-9K])$/.test(clean)) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const mod = 11 - (sum % 11);
  const dvCalc = mod === 11 ? '0' : mod === 10 ? 'K' : String(mod);
  return dvCalc === dv;
}

export function maxLength(value, max) {
  return String(value || '').length <= max;
}

export function minLength(value, min) {
  return String(value || '').length >= min;
}

export function isNonNegativeInteger(n) {
  return Number.isInteger(Number(n)) && Number(n) >= 0;
}

export function isNonNegativeNumber(n) {
  const num = Number(n);
  return !Number.isNaN(num) && num >= 0;
}