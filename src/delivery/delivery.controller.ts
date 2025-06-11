import { Body, Controller, Get, Res } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { OrderRequest } from './request/order.request';
import { Response } from 'express';

@Controller('delivery')
export class DeliveryController {
    constructor (
        private readonly deliveryService: DeliveryService,
    ) {}

    @Get()
    getDeliverySlots(@Body() req: OrderRequest, @Res() res: Response) {
       const deliverySlots = this.deliveryService.getDeliverySlots(req);
         return res.status(200).json({
            deliverySlots: deliverySlots,
            message: 'Delivery slots retrieved successfully'
        });
    }
}
