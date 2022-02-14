export const getQueryStringsFormatted = (idObj) => {
    let queryString = ""
    Object.keys(idObj).forEach(key => {queryString = queryString + '?' + key + '=' + idObj[key] + '&'})
    return queryString.substring(0, queryString.length - 1);
}

export const pageSize = 10;

export const getOffsetString = (pageNum) => {
    if(pageNum != -1){
        return `limit=${pageSize}&offset=${pageSize * pageNum}`;
    }
    return `limit=&offset=`;
}

const doesValExist = (val) => {
    return val != null && val !== undefined
}

export const getParameters = (params) => {
    let parameters = params;
    if(doesValExist(parameters.pageNum)){
        if(parameters.pageNum != -1){
            parameters = {
              limit: pageSize,
              offset: pageSize * (parameters.pageNum-1),
              ...parameters
            }
        }
        delete parameters.pageNum;
    }

    if(doesValExist(parameters.ordering)){
        parameters.ordering = `${parameters.ordering},id`
    }
    return parameters;
}
