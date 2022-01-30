export const getQueryStringsFormatted = (idObj) => {
    let queryString = ""
    Object.keys(idObj).forEach(key => {queryString = queryString + '?' + key + '=' + idObj[key] + '&'})
    return queryString.substring(0, queryString.length - 1);
}