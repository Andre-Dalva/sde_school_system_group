import {editing, startToCreate} from "./courseManager.js";

const courseBody = document.getElementById("allCourses");
const addBox = document.getElementById("newCourse");
const addSign = document.getElementById("addSign");
addSign.addEventListener("click",()=>startToCreate(courseBody,addBox));

const editingSetter = document.getElementById("editingSetter");
editingSetter.onclick = () => editing(Array.from(document.getElementsByClassName("edit")));