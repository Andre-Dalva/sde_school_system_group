import {showSteps} from "./register-showfunction.js";
const registerForm = document.getElementById("registerForm");
const firstForm = registerForm.innerHTML;
const collectedData = {};

function getForm(){
    const userRegisterData = new FormData(registerForm);
    
    for(const[key, value] of userRegisterData.entries()){
        collectedData[key] = value;
    }
    console.log(collectedData)
}

showSteps(1,firstForm, registerForm,getForm);