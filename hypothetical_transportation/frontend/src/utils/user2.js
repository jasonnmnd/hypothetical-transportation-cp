
export default function getType(user){
    if(user.groups == null){
        return ""
    }
    if(user.groups[0] == 1){
        return "admin"
    }
    if(user.groups[0] == 2){
        return "parent"
    }
    if(user.groups[0] == 4){
        return "driver"
    }
    if(user.groups[0] == 3){
        return "staff"
    }
    if (user.groups[0] == 5) {
        return "student"
    }
}