import * as storage from "./storage.js";
import * as ui from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const user = storage.loadUser();
    if (user) {
        ui.show(ui.views.menu);
        return;
    }
    ui.setCurrentUserInfo(user);

    document.getElementById("btn-join").onclick = () => {
        const name = document.getElementById("username").value.trim() || "Игрок";
        const u = storage.saveUser(name);
        ui.setCurrentUserInfo(u);
        ui.show(ui.views.menu);
    };

    document.getElementById("btn-logout").onclick = () => {
        storage.clearUser();
        ui.setCurrentUserInfo(undefined);
    };
});