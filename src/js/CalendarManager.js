/* 
                             = CALENDAR MANAGER =
    The calendar manager is responsible for handling all information related to
    dates, such as the current date, which weekday is the first day of the month
    etc, as well as dynamically creating the elements representing the days.
*/

/**
 * Returns a number representing the amount of days in the date's current
 * month.
 * @param {Date} date The date to get the day amount from.
 * @return {Number} The amount of days in the date's month.
 */
function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/**
 * Gets the name and index of the first weekday of the selected date's month.
 * The function reads from a standard Date object and attempts to parse the
 * string value of it, and returns an "UNDEFINED" weekday if it fails.
 * @param {Date} selectedDate The date that should be used to get the current
 * month.
 * @return {Object} An object containing two properties: a string value called
 * weekday and a number called index.
 */
function getFirstWeekDayInMonth(selectedDate) {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const firstDayDate = new Date(year, month, 1);
    const firstDayDateSlice = firstDayDate
        .toString()
        .split(" ")[0];
    // TODO: Maybe there's a better way to do this, but it works for now, and I
    // can't be bothered with the Date object's arcane nonsense anymore
    switch (firstDayDateSlice) {
        case "Mon":
            return {weekday: "Monday", index: 0};
        case "Tue":
            return {weekday: "Tuesday", index: 1};
        case "Wed":
            return {weekday: "Wednesday", index: 2};
        case "Thu":
            return {weekday: "Thursday", index: 3};
        case "Fri":
            return {weekday: "Friday", index: 4};
        case "Sat":
            return {weekday: "Saturday", index: 5};
        case "Sun":
            return {weekday: "Sunday", index: 6};
        default:
            return {weekDay: "UNDEFINED", index: 0};
    }
}

/**
 * Takes numbers for a day, month and year, and returns a formatted string value
 * that matches the formatting of the API's event objects.
 * @param {Number} day A two-digit number representing day of the month. If a
 * single digit is given, a 0 will be prepended to it.
 * @param {Number} month A two-digit number representing the month, If a
 * single digit is given, a 0 will be prepended to it.
 * @param {Number} year A four-digit number representing the year.
 * @return {String} A string value representing a date in DD-MM-YYYY format.
 */
function getDateString(day, month, year) {
    // Prepend a 0 to the number is it's a single digit
    if (day.toString().length === 1) {
        day = "0" + day;
    }
    if(month.toString().length === 1) {
        month = "0" + month ;
    }

    return `${day}-${month}-${year}`;
}

/**
 Creates an empty array and fills it with as many CalendarDay objects as there
 are days in the specified month, then returns the array.
 @param {Date} selectedDate The date to use as a basis for how many days there are in a month.
 @return {Array} An array of 1-31 CalendarDay objects with their respective dates.
*/
function createCalendarDayData(selectedDate) {
    const dayList = [];
    const numberOfDays = getDaysInMonth(selectedDate);
    for(let i = 0; i < numberOfDays; i++) {
        const dateString = getDateString(i + 1, selectedDate.getMonth() + 1, selectedDate.getFullYear());
        dayList.push(new CalendarDay(dateString)); 
    }
    return dayList;
}

/**
 Creates an empty array and fills it with CalendarEvent objects created from the
 events in the data being passed as an argument. 
 TODO: Should errors be handled here, or only in the API call?
 @param {Object} data The object containing the array of events which will be
 added to the new array.
 @return {Array} An array of X CalendarEvent objects.
*/
function createEventList(data) {
    const eventList = [];
    data.events.forEach(obj => {
        eventList.push(new CalendarEvent(obj));
    });
    return eventList;
}

/**
 * Updates the global event list by reading from the events of all CalendarDays.
*/
function updateEventList(dayList) {
    let newEventList = [];
    dayList.forEach((day) => {
        day.eventList.forEach((obj) => {
            newEventList.push(obj);
        });
    });
    return newEventList;
}

/**
 * Creates and returns a div displaying a number corresponding to the date the
 * div represents on the calendar. The div also has a CSS class which tells it
 * if it belongs to the previous, current or next month.
 * @param {String} type Should be either "previous", "current" or "next".
 * Represents if the day the div represents belongs to the current month, or the
 * next or previous.
 * @param {Number} day A number representing the day of the month the div
 * represents.
 * @return {Element} A div with the class "day_date_number", and a child node of
 * type h4 with the day number.
 */
function createDayDiv(type, day) {
    const dateLabel = document.createElement("h4");
    dateLabel.classList.add("day_date_number");
    dateLabel.textContent = day;

    const newDiv = document.createElement("div");
    newDiv.className= "monthView_day";
    newDiv.classList.add(type);
    newDiv.appendChild(dateLabel);

    return newDiv;
}

/**
 * [Creates divs representing days in a calendar with the selected date as its
 * starting point(usually the current date), and appends them to the specified
 * container.]
 * @param {Date} selectedDate The date which specifies the starting point of
 * the calendar.
 * @param {Element} container The parent DOM elements which will contain the
 * generated divs.
 * @param {Number} gridItemAmount The amount of grid items to be generated.
 * Can be set manually, but should usually be handled by the initCalendar
 * function.
 */
function createCalendarGrid(selectedDate, container, gridItemAmount) {
    const previousMonth = new Date();
    previousMonth.setMonth(selectedDate.getMonth() - 1); 
    const firstDay = getFirstWeekDayInMonth(selectedDate);

    // Getting a list of the last days of the previous month, and using it to
    // get the date numbers to use for the "previous" day divs
    const daysInPreviousMonth = getDaysInMonth(previousMonth);

    // Create an array of all the dates of the previous month, and slice it down
    // to the appropriate amount needed to fill in the calendar
    // TODO: Is there a cleaner way to do this?
    let remainder = [];
    for(let c = 1; c <= daysInPreviousMonth; c++) {
        remainder.push(c);
    }
    remainder = remainder.slice(Math.max(remainder.length - firstDay.index, 0));
    
    // Add the previous days up to the first weekday of the date
    for(let i = 0; i < firstDay.index; i++) {
        const currentDateString = getDateString(remainder[i], previousMonth.getMonth() + 1, previousMonth.getFullYear());
        const newDiv = createDayDiv("previous", remainder[i]);
        newDiv.dataset.date = currentDateString;
        container.appendChild(newDiv);
    }     

    // Add all the days of the current month
    for(let i = 0; i < daysInCurrentMonth; i++) {
        const currentDateString = getDateString(i + 1, selectedDate.getMonth() + 1, selectedDate.getFullYear());
        const newDiv = createDayDiv("current", i + 1);
        newDiv.dataset.date = currentDateString;
        container.appendChild(newDiv);
    }

    // Fill up the rest of the grid with next month's days
    const daysRemaining = gridItemAmount - container.children.length;
    for(let i = 0; i < daysRemaining; i++) {
        const currentDateString = getDateString(i + 1, nextMonth.getMonth() + 1, nextMonth.getFullYear());
        const newDiv = createDayDiv("next", i + 1);
        newDiv.dataset.date = currentDateString;
        container.appendChild(newDiv);
    }

    // Lastly, add the "today" class to the current day
    container.children[selectedDate.getDate() + firstDay.index - 1].classList.add("today");
}

// TODO: Does this belong here? It could belong to the CalendarDay class, but
// since rendering time info will pretty much always be dependent on the actual
// current day to be useful, it makes more sense to not be tied to instances of
// CalendarDay.
function renderDateInfo(date) {
    // TODO: Implement getting and showing the weekday
    //const weekdayEl = document.querySelector("#timeinfo_weekday");
    const dateEl = document.querySelector("#timeinfo_date");

    const day = date.getDate();
    const month = date.getMonth() + 1;
    let monthString = "";
    switch (month) {
        case 1:
            monthString = "January";
            break;
        case 2:
            monthString = "February";
            break;
        case 3:
            monthString = "March";
            break;
        case 4:
            monthString = "April";
            break;
        case 5:
            monthString = "May";
            break;
        case 6:
            monthString = "June";
            break;
        case 7:
            monthString = "July";
            break;
        case 8:
            monthString = "August";
            break;
        case 9:
            monthString = "September";
            break;
        case 10:
            monthString = "October";
            break;
        case 11:
            monthString = "November";
            break;
        case 12:
            monthString = "December";
            break;
        default:
            monthString = "UNDEFINED";
            break;
    }
    const year = date.getFullYear();
    dateEl.textContent = `${monthString} ${day}, ${year}`;
}

function renderTimeInfo(update = true) {
    let now = new Date();
    let hour = now.getHours();
    if(hour.toString().length === 1) {
        hour = "0" + hour;
    }
    let minute = now.getMinutes();
    if(minute.toString().length === 1) {
        minute = "0" + minute;
    }
    const timeEL = document.querySelector("#timeinfo_time");
    timeEL.textContent = `${hour}:${minute}`;
    if(update) {
        setInterval(() => {
            now = new Date();
            hour = now.getHours();
            if(hour.toString().length === 1) {
                hour = "0" + hour;
            }
            minute = now.getMinutes();
            if(minute.toString().length === 1) {
                minute = "0" + minute;
            }
            timeEL.textContent = `${hour}:${minute}`;
        }, 3000);
    }
}

/**
 * Initializes an interactable calendar with the specified date as its starting
 * point.
 * @param {Date} selectedDate The date to be used as the calendar's starting point.
 * @param {Array} eventList The list of CalendarEvents to use to populate the
 * calendar view.
 * @param {Array} dayList The list of CalendarDays in the selected date's month,
 * which will be filled on initialization.
 * @param {Element} container The container for the interactive calendar.
*/
function initCalendar(selectedDate, container, dayList) {
    const firstDayOfSelectedMonth = getFirstWeekDayInMonth(selectedDate);
    // If index is 5(Saturday) or more, 35 grid items is not enough. 
    let maxGridItems = 0;
    if (firstDayOfSelectedMonth.index >= 5) {
        maxGridItems = 42;
    } else {
        maxGridItems = 35;
    }
    createCalendarGrid(selectedDate, container, maxGridItems);
    dayList.forEach(dayObj => {
        dayObj.renderEventPreview(container);
    });

    // TODO: This make the initCalendar function assume that the selected date
    // starting point is the current time for this renderDashBoard call to be
    // relevant and/or useful. Maybe it would be best to not try to account for
    // the user wanting to have it any other way? 
    const currentDay = selectedDate.getDate() - 1;
    dayList[currentDay].renderDashBoard();
    renderDateInfo(selectedDate);
    renderTimeInfo(selectedDate);
}
