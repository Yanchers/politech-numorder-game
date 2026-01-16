export const views = {
    auth: "auth.html",
    menu: "menu.html",
    help: "help.html",
    levels: "levels.html",
    game: "game.html",
    final: "final.html",
    scoreboard: "scoreboard.html",
};

export function show(view) {
    const cur = window.location.pathname.split("/").pop();
    const dest = view.split("/").pop();
    if (cur === dest) return;
    window.location.href = view;
    return;
}
export function setCurrentUserInfo(user) {
    if (!user) {
        document.getElementById("current-user").textContent = "Нет игрока";
        return;
    }
    document.getElementById(
        "current-user"
    ).textContent = `Текущий игрок: ${user.name}`;
}

export function setPlayerInfo(text) {
    document.getElementById("player-info").textContent = text;
}
export function setLevelTitle(text) {
    document.getElementById("level-title").textContent = text;
}
let feedbackTimer = null;
let feedbackCleanupTimer = null;
export function setFeedback(text, duration = 3000) {
    const el = document.getElementById("feedback");
    if (!el) return;
    // очищаем прошлый таймер
    if (feedbackTimer) {
        clearTimeout(feedbackTimer);
        feedbackTimer = null;
    }
    if (feedbackCleanupTimer) {
        clearTimeout(feedbackCleanupTimer);
        feedbackCleanupTimer = null;
    }
    el.textContent = text;
    // добавляем класс анимации появления
    el.classList.remove("feedback-hide");
    el.classList.add("feedback-show");

    // после duration убираем сообщение
    feedbackTimer = setTimeout(() => {
        el.classList.remove("feedback-show");
        el.classList.add("feedback-hide");
        // когда анимация скрытия закончится, очищаем текст
        feedbackCleanupTimer = setTimeout(() => {
            el.classList.remove("feedback-hide");
            el.textContent = "";
            feedbackCleanupTimer = null;
        }, 420); // примерная длительность анимации скрытия
        feedbackTimer = null;
    }, duration);
}

export function updateTimerDisplay(seconds) {
    const el = document.getElementById("timer");
    const minutesStr = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
    const secondsStr = (seconds % 60).toString().padStart(2, "0");
    el.textContent = `${minutesStr}:${secondsStr}`;

    el.classList.remove("timer-warn", "timer-danger");

    if (seconds < 10) el.classList.add("timer-danger");
    else if (seconds < 25) el.classList.add("timer-warn");
}

// вывод списка сложностей
export function renderDifficultiesList(difficulties, onSelect) {
    const list = document.getElementById("difficulties");
    list.innerHTML = "";
    const iconMap = {
        Лёгкий: "smiley",
        Нормальный: "smiley-meh",
        Сложный: "smiley-angry",
        // easy: "smiley",
        // normal: "star",
        // hard: "warning",
    };
    difficulties.forEach((diff) => {
        const btn = document.createElement("button");
        const name = String(diff);
        const iconName = iconMap[name] || iconMap[name.toLowerCase()] || "sparkles";
        const i = document.createElement("i");
        i.className = `ph ph-${iconName}`;
        i.style.marginRight = "8px";
        btn.appendChild(i);
        btn.appendChild(document.createTextNode(name));
        btn.onclick = () => onSelect(diff);
        list.appendChild(btn);
    });
}

// Рендер списка уровней, callback(level) вызывается при выборе
export function renderLevelsList(diff, levels, onSelect) {
    document.getElementById("levels-title").textContent = `Уровни — ${diff}`;
    const list = document.getElementById("levels-list");
    list.innerHTML = "";
    levels.forEach((lvl, idx) => {
        const btn = document.createElement("button");
        btn.appendChild(document.createTextNode(`${idx + 1}. ${lvl.title}`));
        btn.onclick = () => onSelect(lvl);
        list.appendChild(btn);
    });
}

// Рендер самой последовательности и choices. Возвращает функцию для получения всех cell-элементов
export function renderLevelUI(
    lvl,
    handlers = { onSubmit: () => { }, onQuit: () => { } }
) {
    const sequencesEl = document.getElementById("sequences");
    sequencesEl.innerHTML = "";
    const choicesEl = document.getElementById("choices");
    choicesEl.innerHTML = "";

    lvl.sequences.forEach((seq) => {
        const row = document.createElement("div");
        row.className = "sequence";
        seq.forEach((val, i) => {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (val === null) {
                cell.classList.add("blank");
                if (lvl.mode === "drag") {
                    cell.ondragover = (ev) => ev.preventDefault();
                    cell.ondrop = (ev) => {
                        ev.preventDefault();
                        const v = ev.dataTransfer.getData("text/plain");
                        cell.textContent = v;
                        cell.dataset.userValue = v;
                    };
                } else if (lvl.mode === "mixed") {
                    const input = document.createElement("input");
                    // input.style.width = "64px";
                    input.placeholder = "?";
                    input.oninput = () => {
                        cell.dataset.userValue = input.value;
                    };
                    input.ondragover = (ev) => ev.preventDefault();
                    input.ondrop = (ev) => {
                        console.log("ondrop input");
                        ev.preventDefault();
                        const v = ev.dataTransfer.getData("text/plain");
                        // cell.textContent = v;
                        // cell.dataset.userValue = v;
                        input.textContent = v;
                        input.value = v;
                        cell.dataset.userValue = input.value;
                    };
                    cell.appendChild(input);
                } else {
                    const input = document.createElement("input");
                    // input.style.width = "64px";
                    input.placeholder = "?";
                    input.oninput = () => {
                        cell.dataset.userValue = input.value;
                    };
                    input.ondragover = (ev) => ev.preventDefault();
                    input.ondrop = (ev) => {
                        console.log("ondrop input");
                        ev.preventDefault();
                        const v = ev.dataTransfer.getData("text/plain");
                        // cell.textContent = v;
                        // cell.dataset.userValue = v;
                        input.textContent = v;
                        input.value = v;
                        cell.dataset.userValue = input.value;
                    };
                    cell.appendChild(input);
                }
            } else {
                cell.textContent = val;
                cell.dataset.userValue = val;
            }
            row.appendChild(cell);
        });
        sequencesEl.appendChild(row);
    });

    if (lvl.choices && lvl.choices.length > 0) {
        shuffleArray(lvl.choices).forEach((c) => {
            const ch = document.createElement("div");
            ch.className = "choice";
            ch.textContent = c;
            ch.draggable = true;
            ch.ondragstart = (ev) => ev.dataTransfer.setData("text/plain", c);
            choicesEl.appendChild(ch);
        });
    }

    document.getElementById("btn-submit").onclick = handlers.onSubmit;
    document.getElementById("btn-quit").onclick = handlers.onQuit;

    return () =>
        Array.from(sequencesEl.getElementsByClassName("sequence")).map((seq) =>
            Array.from(seq.getElementsByClassName("cell"))
        );
}

export function renderFinalStats(entry) {
    const el = document.getElementById("final-stats");
    // <div class="stat">
    //                 <div class="stat-icon"><i class="ph ph-clock"></i></div>
    //                 <div class="stat-label">Время</div>
    //                 <div class="stat-value">${entry.timeLeft ?? 0}s</div>
    //             </div>
    el.innerHTML = `
        <div class="final-card">
            <div class="final-card-body">
                <div class="stat">
                    <div class="stat-icon"><i class="ph ph-user"></i></div>
                    <div class="stat-label">Игрок</div>
                    <div class="stat-value">${entry.player || "—"}</div>
                </div>
                <div class="stat">
                    <div class="stat-icon"><i class="ph ph-star"></i></div>
                    <div class="stat-label">Очки</div>
                    <div class="stat-value">${entry.score ?? 0}</div>
                </div>
                <div class="stat">
                    <div class="stat-icon"><i class="ph ph-warning"></i></div>
                    <div class="stat-label">Ошибки</div>
                    <div class="stat-value">${entry.errors ?? 0}</div>
                </div>
            </div>
        </div>
        `;
}

export function renderLeaderboard(scores) {
    const board = document.getElementById("leaderboard");
    board.innerHTML = "";
    const table = document.createElement("table");
    // <th><div><i class="ph ph-clock"></i>Время</div></th>
    table.innerHTML = `
    <tr>
    <th><div><i class="ph ph-user"></i>Игрок</div></th>
    <th><div><i class="ph ph-star"></i>Очки</div></th>
    <th><div><i class="ph ph-warning"></i>Ошибки</div></th>
    <th><div><i class="ph ph-sliders"></i>Сложность</div></th>
    </tr>`;
    scores.forEach((s) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${s.player}</td>
        <td>${s.score}</td>
        <td>${s.errors}</td>
        <td>${s.difficulty}</td>`;
        table.appendChild(tr);
    });
    board.appendChild(table);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function playFinalAnimation(entry = { score: 0, errors: 0 }) {
    const score = entry.score;
    const errors = entry.errors;

    // конфигурация по порогам
    let confettiCount = 0;
    if (errors == 0) {
        confettiCount = 12;
    } else if (errors <= 2) {
        confettiCount = 5;
    } else {
        confettiCount = 3;
    }

    // если доступна библиотека https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js
    if (window.confetti) {
        for (let i = 0; i < confettiCount; i++) {
            var audio = new Audio("../assets/confetti-pop.mp3");
            audio.loop = false;
            audio.volume = 0.1;
            audio.play();
            confetti({
                particleCount: 20,
                spread: 1000,
                startVelocity: 30,
                ticks: 80,
                origin: { x: randomNum(0.2, 0.8), y: randomNum(0.3, 0.6) },
            });
            await sleep(200);
        }
    }
}

export function shuffleArray(originalArray) {
    const array = originalArray.slice(); // create a copy
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}
function randomNum(min, max) {
    return Math.random() * (max - min) + min;
}
