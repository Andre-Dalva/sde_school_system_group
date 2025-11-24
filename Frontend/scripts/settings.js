function showOption(contentBox){
    const options = document.getElementsByClassName("settingOption");

    options[0].addEventListener("click", () => contentBox.innerHTML = `Change Name`)
    options[1].addEventListener("click", () => contentBox.innerHTML = `Change Password`)
    options[2].addEventListener("click", () => contentBox.innerHTML = `Delete Account`)
    options[3].addEventListener("click", () => contentBox.innerHTML = `Log Out`)
}

function dropSettings(){
    const mainTag = document.getElementsByTagName("main")[0];
    if (i<1){
        settingButton.innerHTML = `<i class="fa-regular fa-circle-user fa-xl" style="color: #000000;"></i> <i class="fa-solid fa-caret-up fa-lg" style="color: #000000;"></i></i>`;
        const settingsBox = document.createElement("div");
        settingsBox.id = "settingsBox";
        settingsBox.innerHTML = `<h2              id="settingTitle">Settings <a href="settings.html">Zoom Out</a></h2>
                <table id="optionTable">
                    <tr><td class="settingOption"><h3 >Change Username</h3></td> <td rowspan="5" id="settingContent"><div id="contentBox">Choose an option!</div></td></tr>
                    <tr><td class="settingOption"><h3>Change Passowrd</h3></td></tr>
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
let i = 0;
const settingButton = document.getElementById("settings");
settingButton.addEventListener("click", dropSettings);
