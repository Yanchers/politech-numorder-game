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
    ui.renderLeaderboard(storage.getScores().sort((a, b) => b.score - a.score).slice(0, 50));
    Array.from(document.getElementsByClassName("btn-restart")).forEach((b) => {
        b.onclick = () => ui.show(ui.views.menu);
    });
});