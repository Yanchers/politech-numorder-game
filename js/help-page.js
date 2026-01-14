import * as storage from "./storage.js";
import * as ui from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const user = storage.loadUser();
    if (!user) {
        ui.show(ui.views.auth);
        return;
    }
    ui.setCurrentUserInfo(user);
    document.getElementById("btn-logout").onclick = () => {
        storage.clearUser();
        ui.setCurrentUserInfo(undefined);
        ui.show(ui.views.auth);
    };
    document.getElementById("btn-back").onclick = () => ui.show(ui.views.menu);
});