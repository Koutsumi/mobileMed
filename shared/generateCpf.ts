export function generateCPF() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));

  const calc = (base: number[]) => {
    const sum = base.reduce((acc, num, i) => acc + num * (base.length + 1 - i), 0);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calc(n);
  const d2 = calc([...n, d1]);

  return [...n, d1, d2].join('');
}