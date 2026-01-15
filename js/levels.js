/*
  Формат уровня:
  - id, title
  - sequences: массив последовательностей; каждая последовательность - массив чисел или null для пропуска
  - choices: массив чисел для перетаскивания
  - correctAnswers: массив последовательностей с правильными ответами
  - timeLimit: секунды
  - mode: 'drag' | 'input' | 'mixed'
*/
export const LEVELS = {
    easy: {
        title: "Лёгкий",
        numberOfRounds: 3,
        levels: [
            {
                id: "e1",
                title: "Шаг +2",
                // длина 6
                sequences: [[2, 4, null, 8, 10, 12]],
                choices: [6, 10, 5],
                correctAnswers: [[2, 4, 6, 8, 10, 12]],
                timeLimit: 50,
                mode: "drag",
            },
            {
                id: "e2",
                title: "Геометрия ×2",
                // длина 7
                sequences: [[3, 6, 12, null, 48, 96, 192]],
                choices: [20, 24, 13],
                correctAnswers: [[3, 6, 12, 24, 48, 96, 192]],
                timeLimit: 60,
                mode: "drag",
            },
            {
                id: "e3",
                title: "Фибоначчи (малые)",
                // длина 6
                sequences: [[1, null, 2, 3, 5, 8]],
                choices: [1, 2, 3],
                correctAnswers: [[1, 1, 2, 3, 5, 8]],
                timeLimit: 55,
                mode: "mixed",
            },
            {
                id: "e4",
                title: "Шаг +3",
                sequences: [[1, 4, 7, null, 13, 16]],
                choices: [8, 10, 12],
                correctAnswers: [[1, 4, 7, 10, 13, 16]],
                timeLimit: 45,
                mode: "drag",
            },
            {
                id: "e5",
                title: "Лёгкий чередующийся",
                sequences: [[2, null, 6, 8, 10, 12, 14]],
                choices: [3],
                correctAnswers: [[2, 4, 6, 8, 10, 12, 14]],
                timeLimit: 50,
                mode: "mixed",
            },
            {
                id: "e6",
                title: "Геометрия ×3 (малые)",
                sequences: [[1, 3, null, 27, 81]],
                choices: [9, 10, 12],
                correctAnswers: [[1, 3, 9, 27, 81]],
                timeLimit: 55,
                mode: "drag",
            },
        ],
    },

    normal: {
        title: "Нормальный",
        numberOfRounds: 3,
        levels: [
            {
                id: "n1",
                title: "Пропуски через шаг",
                // длина 6, 3 пропуска
                sequences: [[10, null, 30, null, 50, null]],
                choices: [20, 40, 60],
                correctAnswers: [[10, 20, 30, 40, 50, 60]],
                timeLimit: 70,
                mode: "mixed",
            },
            {
                id: "n2",
                title: "Две цепочки",
                // две цепочки длиной 7 с 3+ пропусками
                sequences: [
                    [2, null, 6, null, 10, null, 14],
                    [50, null, 40, null, 30, null, 20],
                ],
                choices: [4, 8, 45, 35, 25],
                correctAnswers: [
                    [2, 4, 6, 8, 10, 12, 14],
                    [50, 45, 40, 35, 30, 25, 20],
                ],
                timeLimit: 80,
                mode: "mixed",
            },
            {
                id: "n3",
                title: "Чередующийся шаг",
                // длина 8, 4 пропуска
                sequences: [[5, null, 15, null, 25, null, 35, null]],
                choices: [10, 20, 30, 40],
                correctAnswers: [[5, 10, 15, 20, 25, 30, 35, 40]],
                timeLimit: 75,
                mode: "input",
            },
            {
                id: "n4",
                title: "Симметричные шаги",
                sequences: [
                    [5, null, 15, null, 25, null],
                    [30, 25, null, 15, null, 5],
                ],
                choices: [10, 20],
                correctAnswers: [
                    [5, 10, 15, 20, 25, 30],
                    [30, 25, 20, 15, 10, 5],
                ],
                timeLimit: 85,
                mode: "mixed",
            },
            {
                id: "n5",
                title: "Умножение и прибавление",
                sequences: [[2, null, 8, 14, null, 26]],
                choices: [5, 20],
                correctAnswers: [[2, 5, 8, 14, 20, 26]],
                timeLimit: 80,
                mode: "mixed",
            },
            {
                id: "n6",
                title: "Фибоначчи (средние)",
                sequences: [[1, null, 2, 3, 5, 8, null]],
                choices: [],
                correctAnswers: [[1, 1, 2, 3, 5, 8, 13]],
                timeLimit: 75,
                mode: "input",
            },
        ],
    },

    hard: {
        title: "Сложный",
        numberOfRounds: 3,
        levels: [
            {
                id: "h1",
                title: "Глубокая геометрия",
                // длина 9, 4 пропуска
                sequences: [[3, null, 12, null, 48, null, 192, null, 768]],
                choices: [6, 24, 96, 384],
                correctAnswers: [[3, 6, 12, 24, 48, 96, 192, 384, 768]],
                timeLimit: 100,
                mode: "mixed",
            },
            {
                id: "h2",
                title: "Чередование и спад",
                // длина 7, 3 пропуска
                sequences: [[10, null, 8, null, 6, null, 4]],
                choices: [9, 7, 5],
                correctAnswers: [[10, 9, 8, 7, 6, 5, 4]],
                timeLimit: 95,
                mode: "mixed",
            },
            {
                id: "h3",
                title: "Степенное убывание",
                // длина 8, 4 пропуска
                sequences: [[256, null, 64, null, 16, null, 4, null]],
                choices: [128, 32, 8, 2],
                correctAnswers: [[256, 128, 64, 32, 16, 8, 4, 2]],
                timeLimit: 110,
                mode: "input",
            },
            {
                id: "h4",
                title: "Глубокая геометрия II",
                sequences: [[2, null, 8, null, 32, null, 128, null, 512]],
                choices: [4, 16, 64, 256],
                correctAnswers: [[2, 4, 8, 16, 32, 64, 128, 256, 512]],
                timeLimit: 110,
                mode: "mixed",
            },
            {
                id: "h5",
                title: "Чередование со спадом",
                sequences: [[81, null, 27, null, 9, null, 3]],
                choices: [54, 18, 6],
                correctAnswers: [[81, 54, 27, 18, 9, 6, 3]],
                timeLimit: 100,
                mode: "mixed",
            },
            {
                id: "h6",
                title: "Степенное убывание II",
                sequences: [[1024, null, 256, null, 64, null, 16, null]],
                choices: [512, 128, 32, 8],
                correctAnswers: [[1024, 512, 256, 128, 64, 32, 16, 8]],
                timeLimit: 120,
                mode: "input",
            },
        ],
    },
};
