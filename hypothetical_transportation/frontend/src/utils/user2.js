
export default function getType(user){
    if(user.groups[0] == 1){
        return "admin"
    }
    if(user.groups[0] == 3){
        return "driver"
    }
    if(user.groups[0] == 4){
        return "staff"
    }
}