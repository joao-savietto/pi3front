export function convertUTCStringToLocalDate(dateString) {
    const timestamp = Date.parse(dateString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const localTime = new Date(timestamp);
    return localTime.toLocaleDateString('en-GB', options);
}
