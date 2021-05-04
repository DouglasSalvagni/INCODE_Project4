module.exports.capitalize = (string) => {
    if (typeof string !== 'string') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports.parseTimeToInt = (time) => {
    
    const filteredTime = time.replace(':','');

    return parseInt(filteredTime);
}
