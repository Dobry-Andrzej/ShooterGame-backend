import {Controller, Get, Res} from '@nestjs/common';
import {AssetsService} from './assets.service';

@Controller('assets')
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {}

    @Get('logo')
    async getAppLogo(
        @Res() res,
    ) {
        return await this.assetsService.getAppLogo(res);
    }
}
