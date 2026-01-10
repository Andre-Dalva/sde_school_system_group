import { fetchClasses } from "../API/coursesAPI.js";
import { startToCreate } from "./courseCreate.js";
import { editing } from "./courseUpdate.js"; 

fetchClasses(startToCreate); 


document.addEventListener("DOMContentLoaded", () => {
    
    const editingSetter = document.getElementById("editingSetter");

    if (editingSetter) {
        editingSetter.onclick = () => {
            const editElements = Array.from(document.getElementsByClassName("edit"));
            editing(editElements);
        };
    } else {
        console.error("Error: Element with ID 'editingSetter' was not found in the DOM.");
    }
});