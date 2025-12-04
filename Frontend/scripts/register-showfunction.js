export function showSteps(step, firstForm, registerForm, getForm){
    switch (step){
        case 1: showFirstStep(firstForm, registerForm,getForm); break;
        case 2: showStudentPasswords(firstForm, registerForm,getForm); break;
        case 3: showStudentValidation(firstForm, registerForm,getForm); break;
        case "tutor": showTutorFinal(firstForm, registerForm,getForm); break;
    }
}

function showFirstStep(firstForm, registerForm, getForm){
    registerForm.innerHTML = firstForm;

    const optionsToRegister = document.getElementsByClassName("options");
    const nextButton = document.getElementById("nextButton");

    Array.from(optionsToRegister).forEach((option) => 
        option.onchange = () => {
            if(optionsToRegister[0].checked) nextButton.onclick = () => {
                getForm();
                showSteps(2,firstForm, registerForm,getForm
                );}

            else if (optionsToRegister[1].checked) nextButton.onclick = () => {
                getForm();
                showSteps("tutor",firstForm, registerForm,getForm
                )};
        }
    )
    ;
}


function showStudentPasswords(firstForm, registerForm, getForm){
    registerForm.innerHTML = `
        <h2 id="formTitle">Create an Account</h2>
        <div class="formSection">
            <label class="formLabel" for="userPassword">Password:</label><br>
            <input type="password" id="userPassword" class="formBox" name="userPassword" placeholder="type your password...">
        </div>

        <div class="formSection">
            <label class="formLabel" for="userPassword2">Repeat the password:</label><br>
            <input type="password" id="userPassword2" class="formBox" name="userPassword2" placeholder="retype your password...">
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

    document.getElementById("previousButton").onclick = () => showSteps(1,firstForm, registerForm, getForm);
    document.getElementById("nextButton").onclick = (e) => {
        getForm();
        showSteps(3, firstForm, registerForm, getForm);
    };
}

function showStudentValidation(firstForm, registerForm,getForm){
    registerForm.innerHTML = `
        <h2 id="formTitle">Create an Account</h2>
         <div class="formSection">
            <label class="formLabel" for="6DigitCode">6-Digit Code:</label><br>
            <input type="text" id="6DigitCode" class="formBox" name="6DigitCode" placeholder="code sended by email">
        </div>

        <div class="formSection registerBlock">
            <button id="previousButton" class="formButton" type="button">
                <i class="fa-solid fa-arrow-left" style="color: #dbd8d8;"></i>
            </button>

            <button id="submitButton" class="formButton" type="submit">Sign Up</button>
        </div>
    `;

    document.getElementById("previousButton").onclick =() => showSteps(2,firstForm, registerForm, getForm);
    
    document.getElementById("submitButton").onclick = (e) => {
        e.preventDefault();
        getForm();
    }
}

function showTutorFinal(firstForm, registerForm, getForm){
    registerForm.innerHTML = `
        <h2 id="formTitle">Create an Account</h2>
        <div class="formSection">
            <label class="formLabel" for="userPassword">Password:</label><br>
            <input type="password" id="userPassword" class="formBox" name="userPassword" placeholder="email or username...">
        </div>

        <div class="formSection">
            <label class="formLabel" for="userPassword2">Repeat the password:</label><br>
            <input type="email" id="userPassword2" class="formBox" name="userPassword2" placeholder="type your password...">
        </div>

        <div class="formSection">
            <label class="formLabel" for="tutorId">Tutor Id:</label><br>
            <input type="text" name="tutorId" class="formBox" id="tutorId" placeholder="type your password...">
        </div>

        <div class="formSection registerBlock">
            <button id="previousButton" class="formButton" type="button">
                <i class="fa-solid fa-arrow-left" style="color: #dbd8d8;"></i>
            </button>

            <button class="formButton" id="submitButton" type="submit">Sign Up</button>
        </div>
    `;

    document.getElementById("previousButton").onclick = () => showSteps(1, firstForm, registerForm, getForm);

    document.getElementById("submitButton").onclick = (e) => {
        e.preventDefault();
        getForm();
    }
}