import * as storage from "./storage.js";
import * as ui from "./ui.js";
import * as game from "./game.js";

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

    const sel = storage.loadSelection();
    console.log('Loaded selection from storage:', sel);
    if (!sel || !sel.difficulty || !sel.levelId) {
        // go back to levels selection
        ui.show(ui.views.levels);
        return;
    }
    const diff = sel.difficulty;
    const lvl = game.GENERATED_LEVELS[diff]?.levels?.find((l) => l.id === sel.levelId);
    if (!lvl) {
        ui.show(ui.views.levels);
        return;
    }
    // initialize game using existing game module
    game.initGame(diff, lvl, user);

    // wire restart / scoreboard buttons if present
    Array.from(document.getElementsByClassName("btn-restart")).forEach((b) => b.onclick = () => ui.show(ui.views.menu));
    Array.from(document.getElementsByClassName("btn-scoreboard")).forEach((b) => b.onclick = () => ui.show(ui.views.scoreboard));
});