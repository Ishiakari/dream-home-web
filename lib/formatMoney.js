export function formatMoneyPHP(value) {
    if (value === null || value === undefined || value === '') return '';

  // Accept numbers or numeric strings like "10000.00"
    const num = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''));

    if (Number.isNaN(num)) return `₱${value}`; // fallback (don’t crash UI)

    return `₱${num.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export function formatMonthlyRentPHP(value) {
    const money = formatMoneyPHP(value);
    return money ? `${money}/mo` : '';
}