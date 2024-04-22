function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // Get hours and pad with leading zero if necessary
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero if necessary
    return `${hours}:${minutes}`;
};

module.exports = {
    getCurrentTime,
};