class CalendarDay {
    constructor(dateString) {
        this.date = dateString;
        this.eventList = this.refreshEventList();
    }
    renderEventList(container) {
        // Update the relevant elements of the dayView to show the info
        // contained in this CalendarDay
        // TODO: For this implementation to be ideal, all data sent between
        // client and server has to be strictly validated and secured.
        container.innerHTML = ``;
        this.eventList.forEach(obj => {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add(`schedule_event`);
            eventDiv.classList.add(`event_type_${obj.type}`);

            //const eventTitle = document.createElement("h3");
            //eventTitle.textContent = obj.name;
            eventDiv.innerHTML = `
                <h3>${obj.startTime} - ${obj.endTime}</h3>
                <h2 class="schedule_event_name">${obj.name}</h2>
                <hr>
                <p class="schedule_event_description">${obj.description}</p>
            `;
            container.appendChild(eventDiv);
        });
    }
    renderSummary(container) {
        container.innerHTML = ``;
        const summary = this.calculateSummary();
        const summaryDiv = document.createElement("div");
        summaryDiv.classList.add(`day_view_full_summary_info`);

        summaryDiv.innerHTML = `
            <h3>Total XP: <span class="xp_earned">${summary.earnedXP}</span>/<span class="xp_available">${summary.totalXP}</span></h3>
            <h3>Tasks: <span class="tasks_done">${summary.finishedTasks}</span>/<span class="tasks_available">${summary.totalTasks}</span></h3>
        `;
        container.appendChild(summaryDiv);
    }
    // Goes through the global list of events and rebuilds this CalendarDay's
    // event list with any events that match its date.
    refreshEventList() {
        const matchingEvents = globalEventList.filter((obj) => {
            // TODO: Is this a proper usage of filter? It works but it feels
            // dirty somehow.
            if(obj.date.toString().trim() === this.date.toString().trim()) {
                return true;
            }
            else {
                return false;
            }
        });
        return matchingEvents;
    }
    calculateSummary() {
        let earnedXP = 0;
        let possibleXP = 0;
        let finishedTasks = 0;
        this.eventList.forEach(obj => {
            let XP = 0;
            switch (obj.difficulty) {
                case 1:
                    XP = 150;
                    possibleXP += XP;
                    break;
                case 2: 
                    XP = 400;
                    possibleXP += XP;
                    break;
                case 3:
                    XP = 750;
                    possibleXP += XP;
                    break;
                default:
                    break;
            }
            if(obj.finished === true) {
                earnedXP += XP;
                finishedTasks++;
            }
        });
        return {earnedXP: earnedXP, totalXP: possibleXP, finishedTasks: finishedTasks, totalTasks: this.eventList.length};
    }
}

class CalendarEvent {
    constructor(eventData) {
        this.id = eventData.id;
        this.name = eventData.name;
        this.description = eventData.description;
        this.date = eventData.date;
        this.startTime = eventData.startTime;
        this.endTime = eventData.endTime;
        this.type = eventData.type;
        this.difficulty = eventData.difficulty;
        this.finished = eventData.finished;
    }
    updateEventInfo(eventData) {
        // TODO: Should an event be able to change its own ID? Probably not. 
        // I'm leaving it out of this update function for now.
        this.name = eventData.name;
        this.description = eventData.description;
        this.date = eventData.date;
        this.startTime = eventData.startTime;
        this.endTime = eventData.endTime;
        this.type = eventData.type;
        this.finished = eventData.finished;
        console.log(`Updated CalendarEvent: ${this.id}`);
    }
}
