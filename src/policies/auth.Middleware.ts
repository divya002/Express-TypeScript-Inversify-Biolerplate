import { BaseMiddleware } from "inversify-express-utils";
import { injectable} from "inversify";
import {Request, Response, NextFunction} from "express";

@injectable()
export class AuthMiddleware extends BaseMiddleware {
    public async handler(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (await req.isAuthenticated()) {
            next();
        } else {
            res.send({ 
                "message":"Not Valid authorization"
            });
        }
    }
}