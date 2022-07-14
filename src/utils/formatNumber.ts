export function formatNumber(value: number) {
    const configFormat = {
        style: "currency",
        currency: "USD"
    }
    return new Intl.NumberFormat("en-US", configFormat).format(value);
}