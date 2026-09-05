// Utilities for Indian Rupee format, Masking, and Number-to-Words

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar) return 'XXXX-XXXX-XXXX';
  const clean = aadhaar.replace(/\D/g, '');
  if (clean.length >= 4) {
    return `XXXX-XXXX-${clean.slice(-4)}`;
  }
  return 'XXXX-XXXX-XXXX';
}

export function maskPAN(pan: string): string {
  if (!pan) return 'XXXXX0000X';
  if (pan.length === 10) {
    return `${pan.slice(0, 2)}XXX${pan.slice(5, 9)}${pan.slice(9)}`;
  }
  return 'XXXXX0000X';
}

export function maskBankAccount(acc: string): string {
  if (!acc) return 'XXXXXXXX0000';
  if (acc.length > 4) {
    return `•••• •••• ${acc.slice(-4)}`;
  }
  return '•••• ••••';
}

export const maskBankAcc = maskBankAccount;

// Convert amount to Indian currency words
export function numberToIndianWords(amount: number): string {
  const words: { [key: number]: string } = {
    0: 'Zero',
    1: 'One',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine',
    10: 'Ten',
    11: 'Eleven',
    12: 'Twelve',
    13: 'Thirteen',
    14: 'Fourteen',
    15: 'Fifteen',
    16: 'Sixteen',
    17: 'Seventeen',
    18: 'Eighteen',
    19: 'Nineteen',
    20: 'Twenty',
    30: 'Thirty',
    40: 'Forty',
    50: 'Fifty',
    60: 'Sixty',
    70: 'Seventy',
    80: 'Eighty',
    90: 'Ninety',
  };

  function convertChunk(n: number): string {
    if (n === 0) return '';
    if (n < 20) return words[n] + ' ';
    if (n < 100) return words[Math.floor(n / 10) * 10] + ' ' + (n % 10 !== 0 ? words[n % 10] + ' ' : '');
    return words[Math.floor(n / 100)] + ' Hundred ' + (n % 100 !== 0 ? convertChunk(n % 100) : '');
  }

  const num = Math.floor(amount);
  if (num === 0) return 'Rupees Zero Only';

  let result = '';

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  if (crore > 0) {
    result += convertChunk(crore) + 'Crore ';
  }
  if (lakh > 0) {
    result += convertChunk(lakh) + 'Lakh ';
  }
  if (thousand > 0) {
    result += convertChunk(thousand) + 'Thousand ';
  }
  if (remainder > 0) {
    result += convertChunk(remainder);
  }

  return `Rupees ${result.trim()} Only`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
