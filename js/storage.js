export const USER_KEY = 'numorder_user';
export const LEADERBOARD_SCORES_KEY = 'numorder_scores';

export function saveUser(name) {
    const user = { name };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}

export function clearUser() {
    localStorage.removeItem(USER_KEY);
}

export function loadUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function saveScore(entry) {
    const raw = localStorage.getItem(LEADERBOARD_SCORES_KEY) || '[]';
    const arr = JSON.parse(raw);
    arr.push(entry);
    localStorage.setItem(LEADERBOARD_SCORES_KEY, JSON.stringify(arr));
}

export function getScores() {
    return JSON.parse(localStorage.getItem(LEADERBOARD_SCORES_KEY) || '[]');
}

export function clearScores() {
    localStorage.removeItem(LEADERBOARD_SCORES_KEY);
}

// Persist selected difficulty and starting level between pages
export const GAME_SELECTION_KEY = 'numorder_selection';
export function saveSelection(selection) {
    // selection: { difficulty: 'easy', levelId: 'e1' }
    localStorage.setItem(GAME_SELECTION_KEY, JSON.stringify(selection));
}
export function loadSelection() {
    const raw = localStorage.getItem(GAME_SELECTION_KEY);
    return raw ? JSON.parse(raw) : null;
}
export function clearSelection() {
    localStorage.removeItem(GAME_SELECTION_KEY);
}

// Persist last game result to be displayed on final page
export const LAST_RESULT_KEY = 'numorder_last_result';
export function saveLastResult(entry) {
    localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(entry));
}
export function loadLastResult() {
    const raw = localStorage.getItem(LAST_RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
}
