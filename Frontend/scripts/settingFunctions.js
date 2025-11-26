
let i = 0;
function showOption(contentBox){
    const options = Array.from(document.getElementsByClassName("settingOption"));

    options.forEach((option, index) =>
        option.addEventListener("click",() => {
 
            options.forEach((option,index) => (option.children[0].classList.remove("activeOption")));

            option.children[0].classList.add("activeOption");
            showContent(index)
        })
    )

    function showContent(index){
        contentBox.style.animation = "none";
        contentBox.offsetHeight;
        switch(index){
            case 0:
                contentBox.innerHTML = `<label for="changeUsername" class="formLabel">New Username:</label>
                                            <input type="text" name="changeUsername" id="changeUsername" class="formBox" placeholder="type a username">
                                            <button class="formButton settingButton" id="changeButton" type="button">Change</button>`;
                contentBox.style.animation = "indicator 0.5s";
                document.getElementById("changeButton").addEventListener("click",()=>console.log("changed"))
                break;
            case 1:
                function nextChangePassword(){
                    const userPassword = "abc123";
                    const oldPassword = document.getElementById("currentPassword").value
                    let myWarn = null;
                    if(oldPassword === userPassword){
                        contentBox.innerHTML = `<label for="newPassword" class="formLabel">New password:</label>
                                            <input type="text" name="changePassword" id="newPassword" class="formBox" placeholder="...">
                                            <label for="newPassword" class="formLabel">Retypre new password:</label>
                                            <input type="text" name="changePassword" id="newPassword1" class="formBox" placeholder="...">
                                            <div class="confirmationSection registerBlock"><button class="formButton" id="confirmationButton" type="button" >Confirm</button> <button class="formButton settingButton cancelButton" type="submit">Cancel</button></div>`
                        contentBox.style.animation = "indicator 1s";
                        document.getElementById("confirmationButton").addEventListener("click",()=> console.log("Changed"));
                    }
                    else if (oldPassword != userPassword){
                        const myH3 = document.createElement("h4");
                        myH3.innerText = "Password do not match";
                        myH3.style.color = "red";
                        contentBox.prepend(myH3);
                    }
                }
                contentBox.innerHTML = `<label for="currentPassword"class="formLabel">Current password:</label>
                                            <input type="text" name="changePassword" id="currentPassword" class="formBox" placeholder="type your current password">
                                            <div class="registerBlock"><a class="formQuestions">Forgot your password?</a> <button class="formButton settingButton" type="button" id="nextButton">Next</button></div>`;
                contentBox.style.animation = "indicator 1s";

                document.getElementById("nextButton").addEventListener("click",nextChangePassword);       
                break;
            case 2:
                function nextDeletePassword(){
                    contentBox.innerHTML = `<label for="currentPassword"class="formLabel">Confirm with your password:</label>
                            <input type="text" name="changePassword" id="currentPassword" class="formBox" placeholder="type your current password"><div class="confirmationSection registerBlock"><button class="formButton" style="background-color:red" type="button" id="confirmationButton">Confirm</button> <button class="formButton settingButton cancelButton" type="submit">Cancel</button></div>`
                    document.getElementById("confirmationButton").addEventListener("click",()=> console.log("Deleted"));

                }


                contentBox.innerHTML = `<label class="formLabel settingsQuetions">Delete your account?</label><p class="warningSentences">(This will permanently delete your account)</p>
                <div class="confirmationSection registerBlock"><button class="formButton" style="background-color:red" type="button" id="nextButton">Yes</button> <button class="formButton settingButton cancelButton" type="submit">No</button></div>`;
                contentBox.style.animation = "indicator 1s";

                document.getElementById("nextButton").addEventListener("click",nextDeletePassword);
                break;
            case 3:
                contentBox.innerHTML = `<label class="formLabel settingsQuetions">Are you sure?</label><p class="warningSentences">(This will log you out)</p>
                <div class="confirmationSection registerBlock"><a href="../index.html"><button class="formButton" style="background-color:red" type="button">Yes</button></a> <button class="formButton settingButton cancelButton" type="submit">No</button></div>`;
                contentBox.style.animation = "indicator 1s";;

                break;
        }
    }
}


export function dropSettings(settingButton,mainTag){
    if (i<1){

        settingButton.innerHTML = `<i class="fa-regular fa-circle-user fa-xl" style="color: #000000;"></i> <i class="fa-solid fa-caret-up fa-lg" style="color: #000000;"></i></i>`;

        const settingsBox = document.createElement("div");
        settingsBox.id = "settingsBox";
        settingsBox.innerHTML = `<h2              id="settingTitle">Settings <a href="settings.html">Zoom Out</a></h2>
                <table id="optionTable">
                    <tr><td class="settingOption"><h3>Change Username</h3></td> <td rowspan="5" id="settingContent"><form id="contentBox" class="siteForm">Choose an option!</form></td></tr>
                    <tr><td class="settingOption"><h3>Change Password</h3></td></tr>
                    <tr><td class="settingOption"><h3>Delete Account</h3></td></tr>
                    <tr><td class="settingOption"><h3>Log Out</h3></td></tr>
                    <td></td>
                </table>`;
        mainTag.prepend(settingsBox);
        showOption(document.getElementById("contentBox"));

        i++;
    }

    else{
        settingButton.innerHTML = `<i class="fa-regular fa-circle-user fa-xl" style="color: #000000;"></i> <i class="fa-solid fa-caret-down fa-lg"></i>`
        mainTag.removeChild(settingsBox);
        i--;
    }
}