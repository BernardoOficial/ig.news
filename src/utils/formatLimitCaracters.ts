export function formatLimitCaracters(word: string, limitCaracters: number, hasEllipsis = false) {
    if(hasEllipsis) {
        return word.slice(0, limitCaracters) + "...";
    }
    return word.slice(0, limitCaracters);
}