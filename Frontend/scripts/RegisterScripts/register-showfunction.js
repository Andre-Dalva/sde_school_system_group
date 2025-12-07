// register-showfunction.js

// We expect collectAndAdvance to be passed into showSteps from the main file.
export function showSteps(step, firstForm, registerForm, getForm, collectAndAdvance){
    switch (step){
        case 1: showFirstStep(firstForm, registerForm, getForm, collectAndAdvance); break;
        case 2: showStudentPasswords(firstForm, registerForm, getForm, collectAndAdvance); break;
        case 3: showStudentValidation(firstForm, registerForm, getForm, collectAndAdvance); break;
        case "tutor": showTutorFinal(firstForm, registerForm, getForm, collectAndAdvance); break;
    }
}

function showFirstStep(firstForm, registerForm, getForm, collectAndAdvance){
    registerForm.innerHTML = firstForm;

    const optionsToRegister = document.getElementsByClassName("options");
    const nextButton = document.getElementById("nextButton");

    Array.from(optionsToRegister).forEach((option) => 
        option.onchange = () => {
            if(optionsToRegister[0].checked) nextButton.onclick = () => {
                // Now collect data from step 1 before moving
                collectAndAdvance(2);
            }

            else if (optionsToRegister[1].checked) nextButton.onclick = () => {
                // Now collect data from step 1 before moving
                collectAndAdvance("tutor");
            };
        }
    );
}


function showStudentPasswords(firstForm, registerForm, getForm, collectAndAdvance){
    registerForm.innerHTML = `
        <h2 id="formTitle">Create an Account</h2>
        <div class="formSection">
            <label class="formLabel" for="password_1">Password:</label><br>
            <input type="password" id="password_1" class="formBox" name="password_1" placeholder="type your password...">
        </div>

        <div class="formSection">
            <label class="formLabel" for="password_2">Repeat the password:</label><br>
            <input type="password" id="password_2" class="formBox" name="password_2" placeholder="retype your password...">
            <p id="password-error" style="color: red; display: none; margin-top: 5px;">Passwords must match and be at least 8 characters long.</p>
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
    
    const passwordError = document.getElementById("password-error");
    
    document.getElementById("previousButton").onclick = () => showSteps(1,firstForm, registerForm, getForm, collectAndAdvance);
    
    document.getElementById("nextButton").onclick = () => {
        const p1 = document.getElementById("password_1").value;
        const p2 = document.getElementById("password_2").value;

        if (p1 !== p2 || p1.length < 8) {
            passwordError.style.display = 'block';
            return;
        }

        passwordError.style.display = 'none';
        // Collect data from this step before moving
        collectAndAdvance(3); 
    };
}

function showStudentValidation(firstForm, registerForm,getForm, collectAndAdvance){
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

    document.getElementById("previousButton").onclick =() => showSteps(2,firstForm, registerForm, getForm, collectAndAdvance);
    
    document.getElementById("submitButton").onclick = (e) => {
        e.preventDefault();
        // FINAL submission: getForm() collects the last piece of data and calls the API
        getForm(); 
    }
}

function showTutorFinal(firstForm, registerForm, getForm, collectAndAdvance){
    registerForm.innerHTML = `
        <h2 id="formTitle">Create an Account</h2>
        <div class="formSection">
            <label class="formLabel" for="password_1">Password:</label><br>
            <input type="password" id="password_1" class="formBox" name="password_1" placeholder="type your password...">
        </div>

        <div class="formSection">
            <label class="formLabel" for="password_2">Repeat the password:</label><br>
            <input type="password" id="password_2" class="formBox" name="password_2" placeholder="retype your password...">
            <p id="password-error" style="color: red; display: none; margin-top: 5px;">Passwords must match and be at least 8 characters long.</p>
        </div>

        <div class="formSection">
            <label class="formLabel" for="tutorId">Tutor Id:</label><br>
            <input type="text" name="tutorId" class="formBox" id="tutorId" placeholder="Tutor identification code...">
        </div>

        <div class="formSection registerBlock">
            <button id="previousButton" class="formButton" type="button">
                <i class="fa-solid fa-arrow-left" style="color: #dbd8d8;"></i>
            </button>

            <button class="formButton" id="submitButton" type="submit">Sign Up</button>
        </div>
    `;
    
    const passwordError = document.getElementById("password-error");

    document.getElementById("previousButton").onclick = () => showSteps(1, firstForm, registerForm, getForm, collectAndAdvance);

    document.getElementById("submitButton").onclick = (e) => {
        e.preventDefault();
        
        const p1 = document.getElementById("password_1").value;
        const p2 = document.getElementById("password_2").value;
        const tutorId = document.getElementById("tutorId").value;
        
        if (p1 !== p2 || p1.length < 8) {
            passwordError.style.display = 'block';
            return;
        }

        if (tutorId.trim() === "") {
            alert("Tutor ID is required for Tutor registration.");
            return;
        }
        
        passwordError.style.display = 'none';
        getForm(); // FINAL submission
    }
}