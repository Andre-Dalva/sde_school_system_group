import {updateUser, deleteAccount} from "../API/settingsAPI.js";

export function showOption(contentBox) {
    const options = Array.from(document.getElementsByClassName("settingOption"));

    options.forEach((option, index) =>
        option.addEventListener("click", () => {

            options.forEach((option) => (option.children[0].classList.remove("activeOption")));

            option.children[0].classList.add("activeOption");

            showContent(index);
        })
    );

    if (options.length > 0) {
        options[0].children[0].classList.add("activeOption");
        showContent(0);
    }

    function showContent(index) {
        
        contentBox.style.animation = "none";
        contentBox.offsetHeight;

        switch (index) {
            case 0:
                contentBox.innerHTML = `
                    <label class="formLabel" for="changeUserName" >New Username:</label>
                    <input type="text" class="formBox" id="changeUserName" placeholder="type a new username">

                    <button class="formButton settingButton" id="changeButton" type="button">Change</button>
                `;
                contentBox.style.animation = "indicator 0.5s";

                document.getElementById("changeButton").addEventListener("click", async () => {
                    const newUsername = document.getElementById("changeUserName").value.trim();

                    if (newUsername) {
                        await updateUser({ username: newUsername });
                    } else {
                        alert("Please enter a new username.");
                    }
                });
                break;

            case 1:
                contentBox.innerHTML = `
                    <label for="newPassword" class="formLabel">New password:</label>
                    <input type="password" id="newPassword" class="formBox" placeholder="min 8 characters">

                    <label for="retypeNewPassword" class="formLabel">Retype new password:</label>
                    <input type="password" id="retypeNewPassword" class="formBox" placeholder="...">

                    <p id="password-error" class="errorMessage" style="color: red; display: none;"></p>

                    <div class="confirmationSection registerBlock">
                        <button class="formButton" id="confirmationButton" type="button" >Confirm</button>
                        <button class="formButton settingButton cancelButton" id="cancelChange" type="button">Cancel</button>
                    </div>
                `;
                contentBox.style.animation = "indicator 1s";

                document.getElementById("cancelChange").addEventListener("click", () => showContent(1));


                document.getElementById("confirmationButton").addEventListener("click", async () => {
                    const p1 = document.getElementById("newPassword").value;
                    const p2 = document.getElementById("retypeNewPassword").value;
                    const errorElement = document.getElementById("password-error");

                    if (p1.length < 8) {
                        errorElement.innerText = "Password must be at least 8 characters long.";
                        errorElement.style.display = 'block';
                        return;
                    }
                    if (p1 !== p2) {
                        errorElement.innerText = "Passwords do not match.";
                        errorElement.style.display = 'block';
                        return;
                    }

                    errorElement.style.display = 'none';
                    await updateUser({ password: p1 });
                });

                break;

            case 2:

                function showDeleteConfirmation() {
                    contentBox.innerHTML = `
                        <label class="formLabel settingsQuetions">Delete your account?</label>
                        <p class="warningSentences">(This will permanently delete your account)</p>

                        <div class="confirmationSection registerBlock">
                            <button class="formButton" id="nextButton" type="button" style="background-color:red">Yes</button>
                            <button class="formButton settingButton cancelButton" type="button">No</button>
                        </div>
                    `;
                    contentBox.style.animation = "indicator 1s";
                    document.getElementById("nextButton").addEventListener("click", showPasswordConfirmation);
                }

                function showPasswordConfirmation() {
                    contentBox.innerHTML = `
                        <label for="confirmPassword"class="formLabel">Confirm with your password to delete:</label>
                        <input type="password" id="confirmPassword" class="formBox" placeholder="type your current password">
                        <p id="delete-error" class="errorMessage" style="color: red; display: none;"></p>

                        <div class="confirmationSection registerBlock">
                            <button class="formButton" id="confirmationButton" type="button" style="background-color:red">Delete</button>
                            <button class="formButton settingButton cancelButton" id="cancelDelete" type="button">Cancel</button>
                        </div>
                    `;

                    document.getElementById("cancelDelete").addEventListener("click", showDeleteConfirmation);

                    document.getElementById("confirmationButton").addEventListener("click", async () => {
                        const password = document.getElementById("confirmPassword").value;
                        const errorElement = document.getElementById("delete-error");

                        errorElement.style.display = 'none';

                        try {
                            await deleteAccount(password);
                        } catch (error) {
                            errorElement.innerText = "Password incorrect. Account not deleted.";
                            errorElement.style.display = 'block';
                        }
                    });
                }

                showDeleteConfirmation();
                break;

            case 3:
                contentBox.innerHTML = `
                    <label class="formLabel settingsQuetions">Are you sure?</label>
                    <p class="warningSentences">(This will log you out)</p>

                    <div class="confirmationSection registerBlock">
                        <a href="../index.html">
                            <button class="formButton" style="background-color:red" type="button" id="logoutYes">Yes</button>
                        </a>
                        
                        <button class="formButton settingButton cancelButton" type="button">No</button>
                    </div>
                `;
                contentBox.style.animation = "indicator 1s";

                document.getElementById("logoutYes").addEventListener("click", () => {
                    localStorage.removeItem("token");
                });

                break;
        }
    }
}
