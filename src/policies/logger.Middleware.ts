import { BaseMiddleware } from "inversify-express-utils";
import { injectable,inject} from "inversify";
import {Request, Response, NextFunction} from "express";
import {Logger} from "../util/logger";
import TYPES from "../constants/types";

@injectable()
export class LoggerMiddleware extends BaseMiddleware {
    @inject(TYPES.Logger) private readonly _logger: Logger;
    public async handler(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (await this.httpContext.user.isAuthenticated()) {
            this._logger.info(`${this.httpContext.user.details.email} => ${req.url}`);
        } else {
            this._logger.info(`Anonymous => ${req.url}`);
        }
        next();
    }
}