interface Event {
    readonly id: string;
    readonly name: string;
    data?: any;
    message: (player: string) => string;
    color?: string;
}