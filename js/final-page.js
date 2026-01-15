import * as storage from "./storage.js";
import * as ui from "./ui.js";

window.addEventListener("DOMContentLoaded", () => {
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
    const entry = storage.loadLastResult();
    if (entry) {
        ui.renderFinalStats(entry);
        // анимация конфетти
        ui.playFinalAnimation(entry);
    }

    document.getElementById("btn-restart").onclick = () => ui.show(ui.views.menu);
    document.getElementById("btn-scoreboard").onclick = () => ui.show(ui.views.scoreboard);
});