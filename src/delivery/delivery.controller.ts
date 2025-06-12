import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { OrderRequest } from './request/order.request';
import { Response } from 'express';

@Controller('delivery')
export class DeliveryController {
    constructor(
        private readonly deliveryService: DeliveryService,
    ) { }

    @Get()
    @Render('index')
    getForm() {
        return {};
    }

    @Post()
    @Render('index')
    getDeliverySlots(@Body() req: OrderRequest) {
        if (!req.orderDate) {
            req.orderDate = new Date().toISOString();
        }
        console.log('Received Order Request:', req);
        const deliverySlots = this.deliveryService.getDeliverySlots(req);
        return {
            deliverySlots: deliverySlots,
            message: 'Delivery slots retrieved successfully'
        };
    }
}
