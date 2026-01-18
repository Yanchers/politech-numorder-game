// пользователь
export const USER_KEY = 'numorder_user';
// данные рейтинга
export const LEADERBOARD_SCORES_KEY = 'numorder_scores';
// выбранная сложность и уровень
export const GAME_SELECTION_KEY = 'numorder_selection';
// последний результат игры (используется в final-page.js)
export const LAST_RESULT_KEY = 'numorder_last_result';
// уровни игры
export const LEVELS_KEY = 'numorder_generated_levels';

// сохранение данных пользователя
export function saveUser(name) {
    const user = { name };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}
// удаление данных пользователя
export function clearUser() {
    localStorage.removeItem(USER_KEY);
}
// загрузка данных пользователя
export function loadUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}
// сохранение записи в рейтинг
export function saveScore(entry) {
    const raw = localStorage.getItem(LEADERBOARD_SCORES_KEY) || '[]';
    const arr = JSON.parse(raw);
    arr.push(entry);
    localStorage.setItem(LEADERBOARD_SCORES_KEY, JSON.stringify(arr));
}
// загрузка всех записей рейтинга
export function getScores() {
    return JSON.parse(localStorage.getItem(LEADERBOARD_SCORES_KEY) || '[]');
}
// очистка всех записей рейтинга
export function clearScores() {
    localStorage.removeItem(LEADERBOARD_SCORES_KEY);
}

// сохранение выбора сложности и уровня
export function saveSelection(selection) {
    // selection: { difficulty: 'easy', levelId: 'e1' }
    localStorage.setItem(GAME_SELECTION_KEY, JSON.stringify(selection));
}
// зарузка выбора сложности и уровня
export function loadSelection() {
    const raw = localStorage.getItem(GAME_SELECTION_KEY);
    return raw ? JSON.parse(raw) : null;
}
export function clearSelection() {
    localStorage.removeItem(GAME_SELECTION_KEY);
}

// сохранение последнего результата игры
export function saveLastResult(entry) {
    localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(entry));
}
// загрузка последнего результата игры
export function loadLastResult() {
    const raw = localStorage.getItem(LAST_RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
}

// сохранить уровни в локальное хранилище
export function saveLevelsToStorage(levels) {
    localStorage.setItem(LEVELS_KEY, JSON.stringify(levels));
}
// загрузить уровни из локального хранилища
export function loadLevelsFromStorage() {
    const raw = localStorage.getItem(LEVELS_KEY);
    return raw ? JSON.parse(raw) : null;
}