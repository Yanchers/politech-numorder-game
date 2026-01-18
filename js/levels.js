/*
  - title: имя сложности
  - numberOfRounds: количество раундов
  - sequenceLength: длина каждой последовательности
  - sequencesPerLevel: сколько последовательностей в одном уровне
  - holes: минимальное кол-во пропусков и максимальная доля пропусков
  - baseTypes: базовые типы последовательностей для генерации (arithmetic, geometric, step)
  - allowedModes: какие режимы взаиомодействия допустимы (drag/input/mixed)
  - timeLimitRange: ограничение по времени (секунды)
*/

export const LEVEL_TEMPLATES = {
    easy: {
        title: "Лёгкий",
        numberOfRounds: 3,
        sequenceLength: { min: 4, max: 6 },
        sequencesPerLevel: { min: 1, max: 1 },
        holes: { min: 1, maxFraction: 0.5 },
        baseTypes: ["arithmetic", "geometric", "step"],
        allowedModes: ["drag", "mixed"],
        timeLimitRange: { min: 40, max: 70 },
    },

    normal: {
        title: "Нормальный",
        numberOfRounds: 3,
        sequenceLength: { min: 5, max: 8 },
        sequencesPerLevel: { min: 1, max: 2 },
        holes: { min: 1, maxFraction: 0.5 },
        baseTypes: ["arithmetic", "geometric", "step"],
        allowedModes: ["drag", "input", "mixed"],
        timeLimitRange: { min: 60, max: 90 },
    },

    hard: {
        title: "Сложный",
        numberOfRounds: 3,
        sequenceLength: { min: 6, max: 9 },
        sequencesPerLevel: { min: 1, max: 3 },
        holes: { min: 1, maxFraction: 0.5 },
        baseTypes: ["arithmetic", "geometric", "step"],
        allowedModes: ["input", "mixed"],
        timeLimitRange: { min: 80, max: 130 },
    },
};
