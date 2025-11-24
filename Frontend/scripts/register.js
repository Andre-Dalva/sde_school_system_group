const registerForm = document.getElementById("registerForm");
const optionsToRegister = document.getElementsByClassName("options");
const formButtons = document.getElementsByClassName("formButton");
const previous = [registerForm.innerHTML];

function checkStatus(){
    if(optionsToRegister[0].checked) formButtons[0].onclick = studentNext;
    else if (optionsToRegister[1].checked)formButtons[0].onclick = tutorFinal;
}
formButtons[0].addEventListener("click", () => 
    previous.push(registerForm.innerHTML));
function previousRegister(){
    registerForm.innerHTML = previous.pop();
}
function studentNext(){
    registerForm.innerHTML = `<h2 id="formTitle">Create an Account</h2>
            <div class="formSection">
                <label class="formLabel" for="userPassword">Password:</label><br>
                <input type="password" class="formBox" id="userPassword" placeholder="type your password...">
            </div>
            <div class="formSection">
                <label class="formLabel" for="userPassword2">Repeat the password:</label><br>
                <input type="email" class="formBox" id="userPassword2" placeholder="retype your password...">
            </div>
            <div class="formSection" id="registerBlock">
                <button class="formButton" type="button" onclick="previousRegister()"><i class="fa-solid fa-arrow-left" style="color: #dbd8d8;"></i></button>
                <button class="formButton" type="button"  onclick="studentFinal()"><i class="fa-solid fa-arrow-right" style="color: #dbd8d8;"></i></button>
            </div>`
}
function studentFinal(){
    
    registerForm.innerHTML = `<h2 id="formTitle">Create an Account</h2>
            <div class="formSection">
                <label class="formLabel" for="6DigitCode">6-Digit Code:</label><br>
                <input type="text" class="formBox" id="6DigitCode" placeholder="code sended by email">
            </div>
            <div class="formSection" id="registerBlock">
                <button class="formButton" type="button" onclick="previousRegister()"><i class="fa-solid fa-arrow-left" style="color: #dbd8d8;"></i></button>
                <button class="formButton" type="submit">Sign Up</button>
            </div>`
}

function tutorFinal(){
    registerForm.innerHTML = `<h2 id="formTitle">Create an Account</h2>
            <div class="formSection">
                <label class="formLabel" for="userPassword">Password:</label><br>
                <input type="password" class="formBox" id="userPassword" placeholder="email or username...">
            </div>
            <div class="formSection">
                <label class="formLabel" for="userPassword2">Repeat the password:</label><br>
                <input type="email" class="formBox" id="userPassword2" placeholder="type your password...">
            </div>
            <div class="formSection">
                <label class="formLabel" for="tutorId">Tutor Id:</label><br>
                <input type="text" class="formBox" id="tutorId" placeholder="type your password...">
            </div>
            <div class="formSection" id="registerBlock">
                <button class="formButton" type="button" onclick="previousRegister()"><i class="fa-solid fa-arrow-left" style="color: #dbd8d8;"></i></button>
                <button class="formButton" type="submit">Sign Up</button>
            </div>`
}