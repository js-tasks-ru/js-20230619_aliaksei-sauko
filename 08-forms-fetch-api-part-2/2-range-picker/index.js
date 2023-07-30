import Component from "../../common/component.js";
import * as dateHelper  from "../../common/helpers/date-helper.js";
import { generateElement } from "../../common/helpers/element-helper.js";

export default class RangePicker extends Component {

    #isStartedRangeSelection = false;

    constructor(options = {}) {
        super();

        const dateNow = new Date();
        const { from = dateNow, to = dateNow, locale = 'ru-ru' } = options;

        this.locale = locale;
        this.from = from;
        this.to = to;
        this.rightCalendarDate = new Date(to.getFullYear(), to.getMonth(), 1);
        
        this.render();
    }

    destroy() {
        this.remove();
    }

    render() {
        const rangePickerElement = generateElement(RangePicker.fillTemplate(this.from, this.to, { locale: this.locale }));

        this.element = rangePickerElement;

        this.subElements.input.addEventListener('click', this.#handleOpenClick);
        this.subElements.selector.addEventListener('click', this.#handleSelectorClick, { bubbles: true });

        document.addEventListener('click', this.#handleCloseClick, { bubbles: true });
    }

    remove() {
        this.subElements.input.removeEventListener('click', this.#handleOpenClick);
        this.subElements.selector.removeEventListener('click', this.#handleSelectorClick, { bubbles: true });
        document.removeEventListener('click', this.#handleCloseClick, { bubbles: true });

        this.element?.remove();
    }

    //
    // private

    #handleOpenClick = (e) => {
        if (!this.subElements.selector.innerHTML) {
            this.subElements.selector.innerHTML = RangePicker.fillRangePickerSelectorTemplate(this.to, this.locale);
        }

        if (this.element.classList.contains('rangepicker_open')) {
            this.element.classList.remove('rangepicker_open');
        } else {
            this.#removeSelectedRange();
            this.#renderSelectedRange(this.from, this.to);

            this.element.classList.add('rangepicker_open');
        }
    }

    #handleSelectorClick = (e) => {

        if (e.target.classList.contains('rangepicker__selector-control-left')) {
            this.rightCalendarDate = new Date(this.rightCalendarDate.getFullYear(), this.rightCalendarDate.getMonth() - 1, 1);

            this.#renderCalendars();
        }

        if (e.target.classList.contains('rangepicker__selector-control-right')) {
            this.rightCalendarDate = new Date(this.rightCalendarDate.getFullYear(), this.rightCalendarDate.getMonth() + 1, 1);

            this.#renderCalendars();
        }

        if (e.target.classList.contains('rangepicker__cell')) {

            if (!this.#isStartedRangeSelection) {
                this.from = new Date(e.target.dataset.value);
                this.to = '';

                this.#isStartedRangeSelection = true;

                this.#removeSelectedRange();
                this.#renderSelectedRange(this.from, this.to);

                return;
            }

            const selectedData = new Date(e.target.dataset.value);
            if (selectedData < this.from) {
                this.to = this.from;
                this.from = selectedData;
            } else {
                this.to = new Date(e.target.dataset.value);
            }

            this.#isStartedRangeSelection = false;

            this.#removeSelectedRange();
            this.#renderSelectedRange(this.from, this.to);
            this.#renderRangeField();

            const dateSelectEvent = new CustomEvent('date-select', { bubbles: true });
            this.element.dispatchEvent(dateSelectEvent);
        }
    }

    #handleCloseClick = (e) => {
        if (!this.element.contains(e.target)) {
            this.element.classList.remove('rangepicker_open');
        }
    }

    #renderCalendars() {
        this.#removeCalendars();

        const leftCalendarDate = new Date(this.rightCalendarDate.getFullYear(), this.rightCalendarDate.getMonth() - 1, 1);

        const leftCalendarElement = generateElement(RangePicker.fillRangePickerCalendar(leftCalendarDate, this.locale));
        const rightCalendarElement = generateElement(RangePicker.fillRangePickerCalendar(this.rightCalendarDate, this.locale));

        this.subElements.selector.append(leftCalendarElement);
        this.subElements.selector.append(rightCalendarElement);
    }

    #renderRangeField() {
        this.subElements.from.innerHTML = this.from ? dateHelper.toLocaleDateString(this.from, { locale: this.locale, }) : '';
        this.subElements.to.innerHTML = this.to ? dateHelper.toLocaleDateString(this.to, { locale: this.locale, }) : '';
    }

    #renderSelectedRange(from = '', to = '') {
        const dayElements = this.subElements.selector.querySelectorAll('.rangepicker__cell');

        dayElements.forEach(dayElement => {
            const date = new Date(dayElement.dataset.value);
            const dateWithOutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const fromWithOutTime = from ? new Date(from.getFullYear(), from.getMonth(), from.getDate()) : '';
            const toWithOutTime = to ? new Date(to.getFullYear(), to.getMonth(), to.getDate()) : '';

            if (dateWithOutTime > fromWithOutTime && dateWithOutTime < toWithOutTime) {
                dayElement.classList.add('rangepicker__selected-between');
            } else if (from && dateWithOutTime - fromWithOutTime === 0) {
                dayElement.classList.add('rangepicker__selected-from');
            } else if (to && dateWithOutTime - toWithOutTime === 0) {
                dayElement.classList.add('rangepicker__selected-to');
            }
        });
    }

    #removeSelectedRange() {
        const dayElements = this.subElements.selector.querySelectorAll('.rangepicker__cell');

        dayElements.forEach(element => {
            element.className = 'rangepicker__cell';
        });
    }

    #removeCalendars() {
        const calendarElements = this.subElements.selector.querySelectorAll('.rangepicker__calendar');

        calendarElements.forEach(element => {
            element.remove();
        });
    }

    //
    // static

    static fillTemplate(from, to, { locale = 'ru-ru' } = {}) {
        return `<div class="rangepicker ">
                    <div class="rangepicker__input" data-element="input">
                        <span data-element="from">${dateHelper.toLocaleDateString(from, { locale: locale, })}</span> -
                        <span data-element="to">${dateHelper.toLocaleDateString(to, { locale: locale, })}</span>
                    </div>
                    <div class="rangepicker__selector" data-element="selector"></div>
                </div>`;
    }

    static fillRangePickerSelectorTemplate(rightDate, locale = 'ru-ru') {
        const leftDate = new Date(rightDate.getFullYear(), rightDate.getMonth(), 0);

        return `<div class="rangepicker__selector-arrow"></div>
                <div class="rangepicker__selector-control-left"></div>
                <div class="rangepicker__selector-control-right"></div>
                ${this.fillRangePickerCalendar(leftDate, locale)}
                ${this.fillRangePickerCalendar(rightDate, locale)}
                `;
    }

    static fillRangePickerCalendar(date, locale = 'ru-ru') {
        const month = dateHelper.toMonthString(date, { locale: locale });

        return `<div class="rangepicker__calendar">
                    <div class="rangepicker__month-indicator">
                        <time datetime="${month}">${month}</time>
                    </div>
                    ${RangePicker.fillDaysOfWeekTemplate(locale)}
                    ${RangePicker.fillDateGridTemplate(date)}
                </div>`;
    }

    static fillDateGridTemplate(date) {
        const daysOfMonth = dateHelper.getLastDayOfMonth(date);

        let daysTemplate = '';
        let day = 1;
        let currentDay = new Date(date.getFullYear(), date.getMonth(), day);

        do {
            daysTemplate += this.fillDateButtonTemplate(currentDay);

            currentDay.setDate(currentDay.getDate() + 1);
            day++;
        } while (day <= daysOfMonth);

        return `<div class="rangepicker__date-grid">${daysTemplate}</div>`;
    }

    static fillDaysOfWeekTemplate(locale = 'ru-ru') {
        const daysOfWeek = dateHelper.getDaysOfWeek({ locale: locale });

        let weekDaysTemplate = '';
        for (const n in daysOfWeek) {
            if (Object.hasOwnProperty.call(daysOfWeek, n)) {
                const day = daysOfWeek[n];
                weekDaysTemplate += RangePicker.fillDayOfWeekTemplate(day);
            }
        }

        return `<div class="rangepicker__day-of-week">${weekDaysTemplate}</div>`;
    }

    static fillDayOfWeekTemplate(dayOfWeek) {
        return `<div>${dayOfWeek}</div>`;
    }

    static fillDateButtonTemplate(date) {
        const day = date.getDate();
        const weekNumber = 1 + date.getDay();

        const startFromStyle = day === 1 ? `style="--start-from: ${weekNumber}"` : '';

        return `<button type="button" class="rangepicker__cell" data-value="${date.toISOString()}" ${startFromStyle}>${day}</button>`;
    }
}
