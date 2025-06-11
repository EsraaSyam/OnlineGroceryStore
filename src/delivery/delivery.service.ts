import { Injectable } from '@nestjs/common';
import { format, parse, addDays, startOfDay } from "date-fns";
import { OrderRequest } from './request/order.request';
import { ProductType } from './enum/product-type.enum';
@Injectable()
export class DeliveryService {
    getDeliverySlots(req: OrderRequest) {
        const orderDateTime = this.parseDate(req.orderDate);

        const lastDeliveryDate = this.formatDate(addDays(orderDateTime, 14));

        console.log('Order Date:', lastDeliveryDate);

        const products = req.products.map(product => product.type);

        const hasExternal = products.includes(ProductType.EXTERNAL);

        const hasFreshFood = products.includes(ProductType.FRESH_FOOD);

        const hasInStock = products.includes(ProductType.IN_STOCK);

        const firstDeliveryDate = this.calcFirstDeliveryDate(orderDateTime, hasExternal, hasFreshFood, hasInStock);

        console.log('First Delivery Date:', firstDeliveryDate);

        const firstDeliveryDateObj = this.parseDate(firstDeliveryDate);

        const lastDeliveryDateObj = this.parseDate(lastDeliveryDate);

        const deliverySlots = this.generateDeliverySlots(firstDeliveryDateObj, lastDeliveryDateObj, hasExternal);

        return deliverySlots;

    }

    private parseDate(dateString: string): Date {
        const date = parse(dateString, "yyyy-MM-dd\'T\'HH:mm:ss", new Date());
        return date;
    }

    private formatDate(date: Date): string {
        return format(date, "yyyy-MM-dd\'T\'HH:mm:ss");
    }

    private isGreenTimeSlot(date: Date): boolean {
        const hours = date.getHours();

        // Green time slots are between 13:00–15:00 and 20:00–22:00
        if ((hours >= 13 && hours < 15) || (hours >= 20 && hours < 22)) {
            return true;
        }

        return false;
    }

    private generateDeliverySlots(firstDeliveryDate: Date, lastDeliveryDate: Date, isExternal: boolean) {
        const deliverySlots = [];
        for (let currentDate = firstDeliveryDate; currentDate <= lastDeliveryDate; currentDate = addDays(currentDate, 1)) {
            if (!this.isValidDeliveryDay(currentDate, isExternal)) {
                do {
                    currentDate = addDays(currentDate, 1);
                } while (!this.isValidDeliveryDay(currentDate, isExternal));
            }

            const day = format(currentDate, 'EEEE');

            const timeSlots = [];

            let startHour = 8;

            if (currentDate.getHours() > 0) {
                startHour = currentDate.getHours() + 1;
            }

            for (let hour = startHour; hour < 22; hour++) {
                const slotStart = new Date(currentDate);
                slotStart.setHours(hour, 0, 0, 0);

                const slotEnd = new Date(currentDate);
                slotEnd.setHours(hour + 1, 0, 0, 0);

                timeSlots.push({
                    startTime: format(slotStart, 'HH:mm'),
                    endTime: format(slotEnd, 'HH:mm'),
                    isGreen: this.isGreenTimeSlot(slotStart)
                }); 
            }

            deliverySlots.push({
                date: format(currentDate, 'yyyy-MM-dd'),
                day: day,
                timeSlots: timeSlots
            });

        }

        return deliverySlots;
    }

    private isValidDeliveryDay(date: Date, isExternal: boolean): boolean {
        const day = date.getDay();
        // 0 = Sunday, 6 = Saturday
        if (isExternal) {
            return day >= 2 && day <= 5; // Tuesday to Friday
        }

        return day >= 1 && day <= 5; // Monday to Friday

    }

    private calcFirstDeliveryDate(orderDate: Date, hasExternal: boolean, hasFreshFood: boolean, hasInStock: boolean): string {
        let cnt = 0;
        // Check if the order date is a valid delivery day
        while (!this.isValidDeliveryDay(orderDate, hasExternal)) {
            orderDate = addDays(orderDate, 1);
            cnt++;
        }

        console.log(cnt);

        if (hasExternal && cnt < 3) {
            orderDate = addDays(orderDate, 3 - cnt);
            orderDate = startOfDay(orderDate);
            return this.formatDate(orderDate);
        }

        if (!cnt && hasFreshFood && (orderDate.getHours() > 12 || (orderDate.getHours() === 12 && orderDate.getMinutes() > 0))) {
            orderDate = addDays(orderDate, 1);
            orderDate = startOfDay(orderDate);
            return this.formatDate(orderDate);
        }

        if (!cnt && hasInStock && (orderDate.getHours() > 18 || (orderDate.getHours() === 18 && orderDate.getMinutes() > 0))) {
            orderDate = addDays(orderDate, 1);
            orderDate = startOfDay(orderDate);
            return this.formatDate(orderDate);
        }

        return this.formatDate(orderDate);
    }

}