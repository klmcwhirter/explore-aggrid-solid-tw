
function assureQuotes(cell: string): string {
    let rc = cell;
    if (cell.includes('"')) {
        cell = cell.replaceAll('"', '""');
        rc = `"${cell}"`
    }
    return rc;
}

export function assureQuotesInLines(csv: string): string {
    const rc = csv
        .split('\r\n')
        .map(l => l.split(',').map(c => assureQuotes(c)))
        .join('\r\n');
    return rc;
}
