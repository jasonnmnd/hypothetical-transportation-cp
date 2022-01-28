export default function isAdmin(user){
    return user.groups[0] == 1
}