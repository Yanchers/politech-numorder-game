import { GENERATED_LEVELS } from "./game.js";
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
        Object.keys(GENERATED_LEVELS).map((diff) => GENERATED_LEVELS[diff].title),
        (title) => {
            const diff = Object.keys(GENERATED_LEVELS).find(
                (key) => GENERATED_LEVELS[key].title === title
            );
            // save selection and navigate to levels page
            storage.saveSelection({ difficulty: diff });
            ui.show(ui.views.levels);
        }
    );

    document.getElementById("btn-scoreboard").onclick = () => ui.show(ui.views.scoreboard);
    document.getElementById("btn-help").onclick = () => ui.show(ui.views.help);
});