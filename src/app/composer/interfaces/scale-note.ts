export class ScaleNote {
    name: string;
    interval: number;
    intervalName: string;

    constructor(name: string, interval: number, intervalName: string){
        this.name = name;
        this.interval = interval;
        this.intervalName = intervalName;
    }
}
