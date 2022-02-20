export const filterObjectForKey = (obj, predicate) => {
    return Object.keys(obj)
          .filter( key => predicate(key) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} );
}

export const filterObjectForKeySubstring = (obj, substr) => {
    return Object.keys(obj)
          .filter( key => key.includes(substr))
          .reduce( (res, key) => (res[key.replace(substr, "")] = obj[key], res), {} );
}

export const NO_ROUTE = "none"