import {HttpStatus, Injectable} from '@nestjs/common';
import {assetsDir} from '../../utils/stor-dir';
import * as path from 'path';

@Injectable()
export class AssetsService {

    async getAppLogo(res) {
        try {
            res.sendFile(path.join(assetsDir(), 'pictures/', 'logo.png'));
        } catch (error) {
            res.status(HttpStatus.OK).json(error);
        }
    }
}
