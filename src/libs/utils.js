export const generateTimestamp = (min, max) => {
    let d = randomDate(min, max);
    return Math.round(d.getTime() / 1000);
};

export const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const generateTemperature = (min, max) => getRandomInt(min * 10, max * 10) / 10;

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

export const generateObject = (participant_id) => {
    const priorities = [ "HIGH", "MEDIUM", "LOW" ];
    return {
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        timestamp: generateTimestamp(new Date(2020, 2, 1), new Date()),
        participant_id: participant_id,
        temperature: generateTemperature(34.0, 39)
    }
}