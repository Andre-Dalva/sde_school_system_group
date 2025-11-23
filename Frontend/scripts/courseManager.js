export class CreateCourses{
    constructor(courseName,teacherName,classroom,){
        this.courseName = courseName;
        this.teacherName = teacherName;
        this.classroom = classroom;
    }

    set courseName(newCourse){
        if(newCourse == "") window.alert("Course Name is Empty");
        else this._courseName = newCourse;
    }

    set teacherName(newteacherName){
        if(newteacherName == "") window.alert("Teacher Name is Empty");
        else this._teacherName = newteacherName;
    }

    set classroom(newClassroom){
        if(newClassroom == "") window.alert("Classroom is empty");
        else this._classroom = newClassroom;
    }
}
const courses = [];
export function addNewCourse(){
    const course = new CreateCourses(document.getElementById("courseName").value, document.getElementById("inputTutorName").value, Number(document.getElementById("inputClassroom").value));
    courses.push(course);
    console.log(courses)
}