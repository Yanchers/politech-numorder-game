import { saveScore, saveLastResult } from "./storage.js";
import {
    renderLevelUI,
    setLevelTitle,
    setFeedback,
    updateTimerDisplay,
    show,
    views,
} from "./ui.js";
import { LEVELS } from "./levels.js";

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
        onSubmit: () => checkAnswers(lvl),
        onQuit: () => {
            clearInterval(state.timerId);
            show(views.menu);
        },
    });
    state.getCells = getCells;
    // старт таймера
    startTimer(lvl.timeLimit);
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
        onSubmit: () => checkAnswers(lvl),
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

export function checkAnswers(lvl) {
    // останавливаем таймер
    clearInterval(state.timerId);

    const allCells = state.getCells();
    const { correctAnswers, sequences } = LEVELS[state.difficulty].levels.find(
        (l) => l.id === lvl.id
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
    const timeFraction = lvl.timeLimit > 0 ? Math.max(0, state.timeLeft) / lvl.timeLimit : 0;
    const timeBonus = Math.round(timeFraction * BASE_POINT * difficultyMultiplier * 0.5); // up to 50% of BASE_POINT per round
    const penaltyPerError = 50;
    const penalty = roundErrors * penaltyPerError;
    const score = Math.max(0, Math.round(pointsFromCorrect + timeBonus - penalty));
    state.score = score;
    // update totals accumulated across rounds
    state.totalScore += score;
    state.totalErrors += roundErrors;

    if (correctCount === total) {
        setFeedback(`Отлично! (${correctCount}/${total}) 🤩👍 +${state.score} очков`, 2500);
        // setFeedback(`Идеально! 🤩👍 +${state.score} очков`, 2500);
    } else {
        setFeedback(`Почти... (${correctCount}/${total}) +${state.score} очков 🥲👌`, 2500);
    }

    // таймаут для того, чтобы анимация фидбека успела отработать
    setTimeout(() => {
        // увеличиваем счётчик сыгранных раундов
        state.numberOfPlayedRounds++;
        console.log("Сыграно раундов: ", `${state.numberOfPlayedRounds}/${LEVELS[state.difficulty].numberOfRounds}`);
        // если сыграно нужное кол-во раундов - завершаем игру
        if (
            state.numberOfPlayedRounds === LEVELS[state.difficulty].numberOfRounds
        ) {
            finishLevel(true);
        } else {
            // иначе - запускаем следующий доступный уровень
            const availableLevels = LEVELS[state.difficulty].levels.filter(
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
        difficulty: LEVELS[state.difficulty].title,
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