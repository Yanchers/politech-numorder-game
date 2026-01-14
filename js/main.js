import { LEVELS } from "./levels.js";
import * as storage from "./storage.js";
import * as ui from "./ui.js";
import * as game from "./game.js";

function init() {
    const user = storage.loadUser();
    if (user) {
        ui.setCurrentUserInfo(user);
        game.state.user = user;
        ui.show(ui.views.menu);
    } else ui.show(ui.views.auth);

    ui.renderDifficultiesList(
        Object.keys(LEVELS).map((diff) => LEVELS[diff].title),
        (title) => {
            const diff = Object.keys(LEVELS).find(
                (key) => LEVELS[key].title === title
            );
            game.state.difficulty = diff;
            ui.renderLevelsList(LEVELS[diff].title, LEVELS[diff].levels, (lvl) =>
                startLevelHandler(diff, lvl)
            );
        }
    );

    document.getElementById("btn-join").onclick = () => {
        const name = document.getElementById("username").value.trim() || "Игрок";
        const u = storage.saveUser(name);
        ui.setCurrentUserInfo(u);
        game.state.user = u;
        ui.show(ui.views.menu);
    };
    document.getElementById("btn-logout").onclick = () => {
        storage.clearUser();
        game.state.user = undefined;
        ui.setCurrentUserInfo(undefined);
        ui.show(ui.views.auth);
    };

    Array.from(document.getElementsByClassName("btn-back-menu")).forEach(
        (btn) => (btn.onclick = () => ui.show(ui.views.menu))
    );

    document.getElementById("btn-help").onclick = () => ui.show(ui.views.help);
    Array.from(document.getElementsByClassName("btn-scoreboard")).forEach(
        (btn) =>
        (btn.onclick = () => {
            ui.renderLeaderboard(
                storage
                    .getScores()
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 20)
            );
            ui.show(ui.views.scoreboard);
        })
    );
    Array.from(document.getElementsByClassName("btn-restart")).forEach(
        (btn) =>
        (btn.onclick = () => {
            ui.show(ui.views.menu);
        })
    );
}

function startLevelHandler(diff, lvl) {
    // передаём уровень и текущего пользователя в game.initGame
    game.initGame(diff, lvl, game.state.user);
}

init();
