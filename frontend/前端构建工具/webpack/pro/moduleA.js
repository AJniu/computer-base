console.log(`moduleA running`);

class EventBus {
    constructor() {
        this.eventList = {};
    }
    on(eventName, eventCb) {
        if (!this.eventList[eventName]) {
            this.eventList[eventName] = [];
        }
        this.eventList[eventName].push(eventCb);
    }
    emit(eventName, ...payload) {
        const handlers = this.eventList[eventName] || [];
        for (const eventCb of handlers) {
            eventCb(...payload);
        }
    }
}

console.log(`moduleA run off`);

export default new EventBus();
