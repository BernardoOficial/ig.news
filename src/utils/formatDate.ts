export function formatDate(date: string) {
    const configLocale = "pt-BR";
    const configDate: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(date).toLocaleDateString(configLocale, configDate);
}