import { saveScore, saveLastResult, loadLevelsFromStorage, saveLevelsToStorage } from "./storage.js";
import {
    renderLevelUI,
    setLevelTitle,
    animateSequencesBounce,
    setFeedback,
    updateTimerDisplay,
    show,
    views,
} from "./ui.js";
import { LEVEL_TEMPLATES } from "./levels.js";

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function choose(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateBaseSequence(type, length, difficultyKey) {
    const scale = difficultyKey === "easy" ? 1 : difficultyKey === "normal" ? 2 : 4;
    let seq = [];
    if (type === "arithmetic") {
        const start = randInt(1, 5 * scale);
        const diff = randInt(1, 3 * scale);
        for (let i = 0; i < length; i++) seq.push(start + i * diff);
    } else if (type === "geometric") {
        const start = randInt(1, 4);
        const ratio = randInt(2, Math.min(4, 2 + scale));
        for (let i = 0; i < length; i++) seq.push(Math.pow(ratio, i) * start);
    } else {
        // "step" — простой шаг (малые приращения)
        const start = randInt(1, 5 * scale);
        const diff = randInt(1, Math.max(1, 2 * scale));
        for (let i = 0; i < length; i++) seq.push(start + i * diff);
    }
    return seq;
}

function generateLevelPoolForDifficulty(key, template) {
    const poolSize = Math.max(6, template.numberOfRounds * 3);
    const levels = [];
    for (let idx = 0; idx < poolSize; idx++) {
        const sequencesTypes = [];
        const seqCount = randInt(template.sequencesPerLevel.min, template.sequencesPerLevel.max);
        const sequences = [];
        const correctAnswers = [];
        for (let s = 0; s < seqCount; s++) {
            const length = randInt(template.sequenceLength.min, template.sequenceLength.max);
            const baseType = choose(template.baseTypes);
            sequencesTypes.push(baseType);
            const full = generateBaseSequence(baseType, length, key);
            // determine holes count
            const maxHoles = Math.max(
                template.holes.min,
                Math.floor(template.holes.maxFraction * length)
            );
            let holesCount = randInt(template.holes.min, Math.max(template.holes.min, maxHoles));
            holesCount = Math.min(holesCount, Math.max(0, length - 2));

            const holePositions = new Set();
            while (holePositions.size < holesCount) {
                // do not avoid first and last positions
                const pos = randInt(0, length - 1);
                holePositions.add(pos);
            }

            const seqWithHoles = full.map((v, i) => (holePositions.has(i) ? null : v));
            sequences.push(seqWithHoles);
            correctAnswers.push(full);
        }

        // build choices: include all missing values + some distractors
        const missing = [];
        for (const arr of correctAnswers) {
            for (let i = 0; i < arr.length; i++) {
                if (sequences.some((s) => s[i] === null)) {
                    // if any sequence has null at this index, add missing
                }
            }
        }
        // Simpler: collect missing values by scanning sequence arrays
        for (let i = 0; i < sequences.length; i++) {
            for (let j = 0; j < sequences[i].length; j++) {
                if (sequences[i][j] === null) missing.push(correctAnswers[i][j]);
            }
        }

        const distractors = [];
        const targetCount = Math.max(missing.length + 2, Math.min(3, missing.length + 2));
        while (missing.length + distractors.length < targetCount) {
            const base = choose(missing) || randInt(1, 20);
            const delta = randInt(1, 6);
            const candidate = Math.random() < 0.5 ? base + delta : Math.max(1, base - delta);
            if (!missing.includes(candidate) && !distractors.includes(candidate)) distractors.push(candidate);
        }

        const choices = [...new Set([...missing, ...distractors])];

        const timeLimit = randInt(template.timeLimitRange.min, template.timeLimitRange.max);
        const mode = choose(template.allowedModes);

        const idPrefix = key[0];
        levels.push({
            id: `${idPrefix}${idx + 1}`,
            title: `${template.title} ${sequencesTypes.join(' | ')} ${idx + 1}`,
            sequences,
            choices,
            correctAnswers,
            timeLimit,
            mode,
        });
    }
    return levels;
}

// теперь вместо LEVELS у нас GENERATED_LEVELS
export let GENERATED_LEVELS = {};

export let state = {
    user: null,
    difficulty: null,
    level: null,
    timerId: null,
    timeLeft: 0,
    errors: 0,
    score: 0,
    numberOfPlayedRounds: 0,

    totalScore: 0,
    totalErrors: 0,
    playedLevels: [], // массив уже сыгранных уровней (их id)

    getCells: () => [],
};

export function initGame(diff, lvl, user) {
    // начальные данные
    state = {
        ...state,
        difficulty: diff,
        level: lvl,
        user: user,
        errors: 0,
        score: 0,
        playedLevels: [lvl.id], // текущий уровень уже сыгран
        numberOfPlayedRounds: 0,
        totalScore: 0,
    };
    // показываем игровое поле
    show(views.game);
    // ставим информацию
    setLevelTitle(lvl.title);
    // рендерим ячейки последовательностей (сам уровень)
    const getCells = renderLevelUI(lvl, {
        onSubmit: () => checkAnswers(state.level),
        onQuit: () => {
            clearInterval(state.timerId);
            show(views.menu);
        },
    });
    state.getCells = getCells;
    // старт таймера
    startTimer(lvl.timeLimit);

    // подписка на клавишу Enter для сабмита ответов
    document.onkeydown = function (e) {
        if (e.key === "Enter") {
            checkAnswers(state.level);
        }
    };
}

export function startNextLevel(lvl) {
    state = {
        ...state,
        level: lvl,
        playedLevels: [...state.playedLevels, lvl.id],
    };
    // ставим информацию
    setLevelTitle(lvl.title);
    // рендерим ячейки последовательностей
    const getCells = renderLevelUI(lvl, {
        onSubmit: () => checkAnswers(state.level),
        onQuit: () => {
            clearInterval(state.timerId);
            show(views.menu);
        },
    });
    state.getCells = getCells;
    // старт таймера
    startTimer(lvl.timeLimit);
}
// запуск таймера, который каждую секунду обновляет UI и по истечении времени вызывает finishLevel(false) - проигрыш
// параметр sec - количество секунд на уровень
export function startTimer(sec) {
    state.timeLeft = sec;
    updateTimerDisplay(state.timeLeft);
    clearInterval(state.timerId);
    state.timerId = setInterval(() => {
        state.timeLeft--;
        updateTimerDisplay(state.timeLeft);
        if (state.timeLeft <= 0) {
            clearInterval(state.timerId);
            checkAnswers(state.level);
            // finishLevel(false);
        }
    }, 1000);
}

export function checkAnswers() {
    // останавливаем таймер
    clearInterval(state.timerId);

    const allCells = state.getCells();
    const { correctAnswers, sequences } = GENERATED_LEVELS[state.difficulty].levels.find(
        (l) => l.id === state.level.id
    );

    let correctCount = 0,
        total = 0;
    // count errors only for this round (do not accumulate directly into state.errors)
    let roundErrors = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
        const originalSeq = sequences[i];
        const answerSeq = correctAnswers[i];
        const userSeq = allCells[i];
        console.log("Проверка последовательности:", originalSeq, answerSeq, userSeq);
        for (let j = 0; j < originalSeq.length; j++) {
            if (originalSeq[j] != null) continue;
            total++;
            if (answerSeq[j] === parseInt(userSeq[j]?.dataset?.userValue)) {
                userSeq[j].classList.add("correct");
                correctCount++;
            } else {
                userSeq[j].classList.add("highlight");
                roundErrors++;
            }
        }
    }

    // Scoring formula
    // - base points per correct answer, scaled by difficulty
    // - time bonus proportional to remaining time fraction and difficulty
    // - penalty per error
    const difficultyMultiplier = state.difficulty === "easy" ? 1 : state.difficulty === "normal" ? 1.5 : 2;
    const BASE_POINT = 100; // base points for a correct item
    const pointsFromCorrect = correctCount * BASE_POINT * difficultyMultiplier;
    const timeFraction = state.level.timeLimit > 0 ? Math.max(0, state.timeLeft) / state.level.timeLimit : 0;
    const timeBonus = Math.round(timeFraction * BASE_POINT * difficultyMultiplier * 0.5); // up to 50% of BASE_POINT per round
    const penaltyPerError = 50;
    const penalty = roundErrors * penaltyPerError;
    const score = Math.max(0, Math.round(pointsFromCorrect + timeBonus - penalty));
    state.score = score;
    // update totals accumulated across rounds
    state.totalScore += score;
    state.totalErrors += roundErrors;

    animateSequencesBounce();
    if (correctCount === total) {
        setFeedback(`Отлично! (${correctCount}/${total}) 🤩👍 +${state.score} очков`, 2500);
        // setFeedback(`Идеально! 🤩👍 +${state.score} очков`, 2500);
    } else {
        setFeedback(`Почти... (${correctCount}/${total}) +${state.score} очков 🥲👌`, 2500);
    }

    // таймаут для того, чтобы анимация фидбека успела отработать
    setTimeout(() => {
        // увеличиваем счётчик сыграных раундов
        state.numberOfPlayedRounds++;
        console.log("Сыграно раундов: ", `${state.numberOfPlayedRounds}/${GENERATED_LEVELS[state.difficulty].numberOfRounds}`);
        // если сыграно нужное кол-во раундов - завершаем игру
        if (
            state.numberOfPlayedRounds === GENERATED_LEVELS[state.difficulty].numberOfRounds
        ) {
            finishLevel(true);
        } else {
            // иначе - запускаем следующий доступный уровень
            const availableLevels = GENERATED_LEVELS[state.difficulty].levels.filter(
                (l) => !state.playedLevels.includes(l.id)
            );
            const nextLevelIndex = randomNum(0, availableLevels.length - 1);
            const nextLevel = availableLevels[nextLevelIndex];
            startNextLevel(nextLevel);
        }
    }, 2500);
}

export function finishLevel(success) {
    clearInterval(state.timerId);
    const entry = {
        player: state.user.name,
        difficulty: GENERATED_LEVELS[state.difficulty].title,
        level: state.level.id,
        score: state.totalScore,
        errors: state.totalErrors,
        when: Date.now(),
    };
    saveScore(entry);
    // persist last result and navigate to final page where it will be rendered
    saveLastResult(entry);
    show(views.final);
}


function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function regenerateLevels() {
    for (const key of Object.keys(LEVEL_TEMPLATES)) {
        const tpl = LEVEL_TEMPLATES[key];
        GENERATED_LEVELS[key] = { ...tpl, levels: generateLevelPoolForDifficulty(key, tpl) };
    }
    // set levels into localstorage
    saveLevelsToStorage(GENERATED_LEVELS);
}
function init() {
    const savedLevels = loadLevelsFromStorage()
    // create levels dynamically if not already in localstorage
    if (savedLevels === null) {
        console.log('No levels found in storage, generating new levels...');
        for (const key of Object.keys(LEVEL_TEMPLATES)) {
            const tpl = LEVEL_TEMPLATES[key];
            GENERATED_LEVELS[key] = { ...tpl, levels: generateLevelPoolForDifficulty(key, tpl) };
        }
        // set levels into localstorage
        saveLevelsToStorage(GENERATED_LEVELS);
    } else {
        console.log('Levels loaded from storage.');
        GENERATED_LEVELS = savedLevels;
    }
};
init();