export default function isSchoolStaff(user){
    return user.groups[0] == 3
}