export const getQueryStringsFormatted = (idObj) => {
    let queryString = ""
    Object.keys(idObj).forEach(key => {queryString = queryString + '?' + key + '=' + idObj[key] + '&'})
    return queryString.substring(0, queryString.length - 1);
}

export const pageSize = 3;

export const getOffsetString = (pageNum) => {
    if(pageNum != -1){
        return `limit=${pageSize}&offset=${pageSize * pageNum}`;
    }
    return `limit=&offset=`;
}
