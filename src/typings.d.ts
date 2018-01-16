declare module "*data.json" {
    const Data: NavData;
    export = Data;
}

declare interface NavData {
    [id: string]: Floor;
}

export declare interface Floor {
    [id: number]: ClassRoom;
}

export declare interface ClassRoom {
    description?: string;
    connectedTo: number[];
    location: Point;
    hidden?: boolean;
    leadTo?: number;
    number: number;
}

export declare interface Point {
    x: number;
    y: number;
}