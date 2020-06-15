/**
 * Generate a Hex color
 */
export default function GenerateColor(): string {
  const letters = '0123456789ABCDEF';
  const color = new Array(6)
    .fill(0)
    .map(() => letters[Math.floor(Math.random() * 16)])
    .join('');

  return `#${color}`;
}
