import {dropSettings} from "./settingMenus.js";

const mainTag = document.getElementsByTagName("main")[0];
const settingButton = document.getElementById("settings");
const settingButtonMobile = document.getElementById("settings-mobile");
settingButton.addEventListener("click", () => dropSettings(settingButton,mainTag));
settingButtonMobile.addEventListener("click", () => dropSettings(settingButton, mainTag));