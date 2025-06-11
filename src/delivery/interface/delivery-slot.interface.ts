export interface DeliverySlot {
    date: string;
    day: string;
    timeSlots: {
        startTime: string;
        endTime: string;
        isGreen: boolean;
    }[];
}