export default function isAdmin(user){
    return user.groups[0] == 1 || user.groups[0] == 4
}