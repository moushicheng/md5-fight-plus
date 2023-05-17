export class BailEvent {
    message: string
    time: Date

    constructor(message: string = 'bailed') {
        this.message = message
        this.time = new Date()

    }
}
