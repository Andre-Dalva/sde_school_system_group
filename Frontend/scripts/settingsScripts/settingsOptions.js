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
                    <label class="form-label" for="changeUserName" >New Username:</label>
                    <input type="text" class="form-box" id="changeUserName" placeholder="type a new username">

                    <button class="form-button settingButton" id="changeButton" type="button">Change</button>
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
                    <label for="newPassword" class="form-label">New password:</label>
                    <input type="password" id="newPassword" class="form-box" placeholder="min 8 characters">

                    <label for="retypeNewPassword" class="form-label">Retype new password:</label>
                    <input type="password" id="retypeNewPassword" class="form-box" placeholder="...">

                    <p id="password-error" class="errorMessage" style="color: red; display: none;"></p>

                    <div class="confirmationSection registerBlock">
                        <button class="form-button" id="confirmationButton" type="button" >Confirm</button>
                        <button class="form-button settingButton cancel-button" id="cancelChange" type="button">Cancel</button>
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
                        <label class="form-label settings-questions">Delete your account?</label>
                        <p class="warningSentences">(This will permanently delete your account)</p>

                        <div class="confirmation-section">
                            <button class="form-button" id="nextButton" type="button" style="background-color:red">Yes</button>
                            <button class="form-button settingButton cancel-button" type="button">No</button>
                        </div>
                    `;
                    contentBox.style.animation = "indicator 1s";
                    document.getElementById("nextButton").addEventListener("click", showPasswordConfirmation);
                }

                function showPasswordConfirmation() {
                    contentBox.innerHTML = `
                        <label for="confirmPassword" class="form-label">Confirm with your password to delete:</label>
                        <input type="password" id="confirmPassword" class="form-box" placeholder="type your current password">
                        <p id="delete-error" class="errorMessage" style="color: red; display: none;"></p>

                        <div class="confirmation-section">
                            <button class="form-button" id="confirmationButton" type="button" style="background-color:red">Delete</button>

                            <button class="form-button settingButton cancel-button" id="cancelDelete" type="button">Cancel</button>
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
                    <label class="form-label settings-questions">Are you sure?</label>
                    <p class="warningSentences">(This will log you out)</p>

                    <div class="confirmation-section register-block">
                        <a href="../index.html">
                            <button class="form-button" style="background-color:red" type="button" id="logoutYes">Yes</button>
                        </a>
                        
                        <button class="form-button settingButton cancel-button" type="button">No</button>
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
