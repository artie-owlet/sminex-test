class Log {
    public info(message: string): void {
        this.print('info', message);
    }

    public warn(message: string): void {
        this.print('warn', message);
    }

    public error(message: string): void {
        this.print('error', message);
    }

    private print(level: string, message: string): void {
        console.log(`${new Date().toISOString()} ${level}: ${message}`);
    }
}

export const log = new Log();
