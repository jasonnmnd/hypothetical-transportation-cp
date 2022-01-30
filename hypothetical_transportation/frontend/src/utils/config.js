export default function config(token) {
    return {headers: { Authorization: `Token ${token}` }};
}