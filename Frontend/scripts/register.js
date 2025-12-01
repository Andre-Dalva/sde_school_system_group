const registerForm = document.getElementById("registerForm");
const optionsToRegister = document.getElementsByClassName("options");
const formButtons = document.getElementsByClassName("formButton");
const nextButton = document.getElementById("nextButton");
const previous = [];

function getForm(){
    const registerForm = document.getElementById("registerForm");
    const nextButton = document.getElementById("nextButton");

    nextButton.addEventListener("click", (event) => {
        event.preventDefault();
        const loadForm = new FormData(registerForm);
        console.log([...loadForm.entries()]);
    })
}

function checkStatus(){
    previous.push(registerForm.innerHTML);

    if(optionsToRegister[0].checked) nextButton.addEventListener("click", studentNext);
    else if (optionsToRegister[1].checked) nextButton.addEventListener("click", tutorFinal);
}

function previousRegister(){
    registerForm.innerHTML = previous.pop();
    getForm()
}

function studentNext(){
    registerForm.innerHTML = `
        <h2 id="formTitle">Create an Account</h2>
        <div class="formSection">
            <label class="formLabel" for="userPassword">Password:</label><br>
            <input type="password" class="formBox" id="userPassword" placeholder="type your password...">
        </div>

        <div class="formSection">
            <label class="formLabel" for="userPassword2">Repeat the password:</label><br>
            <input type="password" class="formBox" id="userPassword2" placeholder="retype your password...">
        </div>

        <div class="formSection registerBlock">
                <button id="previousButton" class="formButton" type="button">
                    <i class="fa-solid fa-arrow-left" style="color: #dbd8d8;"></i>
                </button>

                <button id="nextButton" class="formButton" type="button">
                    <i class="fa-solid fa-arrow-right" style="color: #dbd8d8;"></i>
                </button>
        </div>
    `;
    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click",studentFinal);
    getForm()
}

function studentFinal(){
    previous.push(registerForm.innerHTML);

    registerForm.innerHTML = `
        <h2 id="formTitle">Create an Account</h2>
         <div class="formSection">
            <label class="formLabel" for="6DigitCode">6-Digit Code:</label><br>
            <input type="text" class="formBox" id="6DigitCode" placeholder="code sended by email">
        </div>

        <div class="formSection registerBlock">
            <button id="previousButton" class="formButton" type="button">
                <i class="fa-solid fa-arrow-left" style="color: #dbd8d8;"></i>
            </button>

            <button id="nextButton" class="formButton" type="submit">Sign Up</button>
        </div>
    `;
    getForm()
}

function tutorFinal(){
    registerForm.innerHTML = `
        <h2 id="formTitle">Create an Account</h2>
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

        <div class="formSection registerBlock">
            <button class="formButton" type="button" onclick="previousRegister()">
                <i class="fa-solid fa-arrow-left" style="color: #dbd8d8;"></i>
            </button>

            <button class="formButton" id="nextButton" type="submit">Sign Up</button>
        </div>
    `;
    getForm()
}

getForm();
Array.from(optionsToRegister).forEach((option) => option.addEventListener("change",checkStatus))