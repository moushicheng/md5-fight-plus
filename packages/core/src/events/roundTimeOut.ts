export class RoundTimeOutEvent {
    message: string
    time: Date

    constructor(message: string = '回合超限！') {
        this.message = message
        this.time = new Date()

    }
}
