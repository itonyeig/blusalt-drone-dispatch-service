import { Controller, Get } from '@nestjs/common';
import { DispatchService } from './dispatch.service';

@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get('status')
  getStatus() {
    return { status: 'Dispatch service is running' };
  }
}
