import {startToCreate} from "./courseManager.js";

const courseBody = document.getElementById("allCourses");
const addBox = document.getElementById("newCourse");
const addSign = document.getElementById("addSign");
addSign.addEventListener("click",()=>startToCreate(courseBody,addBox));