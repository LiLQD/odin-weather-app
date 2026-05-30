export let currentUnit = localStorage.getItem('unit') || 'C';

export function reverseCurrentUnit() {
  currentUnit = currentUnit === 'C' ? 'F' : 'C';
  localStorage.setItem('unit', currentUnit);
}
