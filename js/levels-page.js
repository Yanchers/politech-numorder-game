import * as storage from "./storage.js";
import * as game from "./game.js";
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
    const sel = storage.loadSelection();
    if (!sel || !sel.difficulty) {
        // nothing selected, go back to menu
        ui.show(ui.views.menu);
        return;
    }
    const diffKey = sel.difficulty;
    const savedLevels = game.GENERATED_LEVELS;
    if (!savedLevels || !savedLevels[diffKey]) {
        ui.show(ui.views.menu);
        return;
    }

    const diffObj = savedLevels[diffKey];
    ui.renderLevelsList(diffKey, diffObj.levels, (lvl) => {
        // save starting level id and navigate to game
        storage.saveSelection({ difficulty: diffKey, levelId: lvl.id });
        ui.show(ui.views.game);
    });

    document.getElementById("btn-back-menu").onclick = () => ui.show(ui.views.menu);
});