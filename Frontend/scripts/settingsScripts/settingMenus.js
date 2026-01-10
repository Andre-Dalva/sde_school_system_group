import { showOption } from "./settingsOptions.js";

let i = 0;

export function dropSettings(settingButton, mainTag) {
    const settingsBox = document.getElementById("settingsBox");

    if (i < 1) {

        const newSettingsBox = document.createElement("div");
        newSettingsBox.id = "settingsBox";
        newSettingsBox.innerHTML = `
            <h2 id="settingTitle">
                Settings <i class="fa-solid fa-gear"></i>
            </h2>

            <table id="optionTable">
                <tr>
                    <td class="settingOption">
                        <h3 class="activeOption">Change Username</h3>
                    </td>

                    <td rowspan="4" id="settingContent">
                        <form id="contentBox">
                        </form>
                    </td>

                </tr>

                <tr>
                    <td class="settingOption">
                        <h3>Change Password</h3>
                    </td>
                </tr>

                <tr>
                    <td class="settingOption">
                        <h3>Delete Account</h3>
                    </td>
                </tr>

                <tr>
                    <td class="settingOption">
                        <h3>Log Out</h3>
                    </td>
                </tr>
            </table>
        `;

        settingButton.innerHTML = `
            <i class="fa-regular fa-circle-user fa-xl" style="color: #ffff;"></i>
            <i class="fa-solid fa-caret-up fa-lg" style="color: #ffff;"></i>
        `;

        mainTag.prepend(newSettingsBox);
        showOption(document.getElementById("contentBox"));
        i++;
    }

    else {
        settingButton.innerHTML = `
            <i class="fa-regular fa-circle-user fa-xl" style="color: #ffff;"></i>
            <i class="fa-solid fa-caret-down fa-lg" style="color: #ffff;"></i>
        `;

        if (settingsBox) {
            mainTag.removeChild(settingsBox);
        }
        i--;
    }
}