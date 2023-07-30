export function getDaysOfWeek({ locale = 'ru-ru', weekday = 'short' } = {}) {
    const daysOfWeek = {};

    let date = new Date();
    let i = 1;

    do {
        const dayOfWeek = date.toLocaleString(locale, { weekday: weekday });
        let weekNumber = date.getDay();

        if (locale.includes('ru')) {
            weekNumber = weekNumber === 0 ? 7 : weekNumber
        }

        daysOfWeek[weekNumber] = dayOfWeek.replace(dayOfWeek[0], dayOfWeek[0].toUpperCase());

        date.setDate(date.getDate() + 1);   // add day
        i++;
    } while (i <= 7);

    return daysOfWeek;
}

export function getLastDayOfMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    return new Date(year, month + 1, 0).getDate();
}

export function toMonthString(date, { locale = 'ru-ru', month = 'long' } = {}) {
    return date.toLocaleString(locale, { month: month });
}

export function toLocaleDateString(date, { locale = 'ru-ru', yearFormat = 'long' } = {}) {
    const year = date.getFullYear();
    const dateString = date.toLocaleDateString(locale);

    return yearFormat === 'short' ? dateString.replace(year, year % 100) : dateString;
}
