export class PlayerDeathEvent {
    message: string
    time: Date

    constructor(message: string = 'player death') {
        this.message = message
        this.time = new Date()

    }
}
