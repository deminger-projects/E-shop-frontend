const replaceall = require("replaceall");

export default function fix_file_name(file_name: string){

    file_name = replaceall(" ", "_", file_name)
    file_name = replaceall(",", "_", file_name)
    file_name = replaceall(".", "_", file_name)
    file_name = replaceall("-", "_", file_name)
    file_name = replaceall("/", "_", file_name)

   return file_name
}