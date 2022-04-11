export function formatDate(date: Date): string {
    if (!date) {
        return '';
    }
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getUTCDate()).slice(-2);
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
}