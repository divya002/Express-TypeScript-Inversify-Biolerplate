import { injectable, inject } from "inversify";
import { interfaces } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import TYPES from "../constants/types";

class Principal implements interfaces.Principal {
    public details: any;
    public constructor(user: any) {
        this.details = user;
    }
    public isAuthenticated(): Promise<boolean> {
        console.log("Is Authenticated");
        return Promise.resolve(!!this.details);
    }
    public isResourceOwner(resourceId: any): Promise<boolean> {
        return Promise.resolve(resourceId === 1111);
    }
    public isInRole(role: string): Promise<boolean> {
        return Promise.resolve(role === "admin");
    }
}

@injectable()
export class CustomAuthProvider implements interfaces.AuthProvider {
    @inject(TYPES.UserService) private _userService: UserService;
    public async getUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<interfaces.Principal> {

        if (req.isAuthenticated) {
            const token: string = (req.headers["authorization"])?.split(" ")[1];
            if (token) {
                const user = await this._userService.getUser(token);
                const principal = new Principal(user);
                return principal;
            } else {
                res.send({
                    "message":
                        "Please provide token if already logged in."
                }
                );
            }
            return;
        }
    }
}

