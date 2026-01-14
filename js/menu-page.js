import { LEVELS } from "./levels.js";
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

    ui.renderDifficultiesList(
        Object.keys(LEVELS).map((diff) => LEVELS[diff].title),
        (title) => {
            const diff = Object.keys(LEVELS).find(
                (key) => LEVELS[key].title === title
            );
            // save selection and navigate to levels page
            storage.saveSelection({ difficulty: diff });
            ui.show(ui.views.levels);
        }
    );

    document.getElementById("btn-scoreboard").onclick = () => ui.show(ui.views.scoreboard);
    document.getElementById("btn-help").onclick = () => ui.show(ui.views.help);
});