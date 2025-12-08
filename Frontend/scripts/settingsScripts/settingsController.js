import {dropSettings} from "./settingMenus.js";

const mainTag = document.getElementsByTagName("main")[0];
const settingButton = document.getElementById("settings");
settingButton.addEventListener("click", () => dropSettings(settingButton,mainTag));