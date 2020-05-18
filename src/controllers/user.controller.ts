/* eslint-disable @typescript-eslint/camelcase */
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, httpPost } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import TYPES from "../constants/types";
import { check, sanitize, validationResult } from "express-validator";

@controller("/user")
export class UserController extends BaseHttpController {
    constructor(@inject(TYPES.UserService) private userService: UserService) {
        super();
    }
    @httpGet("/")
    public getUsers(req: Request, res: Response) {
        try {
            throw new Error("Error");
        } catch (err) {
            res.send({
                data: err
            });
        }

    }

    /**
 * POST /signup
 * Create a new local account.
 */
    @httpPost("/signup")
    public async postSignup(req: Request, res: Response, next: NextFunction) {
        try {
            await check("email", "Email is not valid").isEmail().run(req);
            await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
            await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
            // eslint-disable-next-line @typescript-eslint/camelcase
            await check("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return this.json({
                    data: errors.array(),
                    message: "Check errors to procced"
                }, 403);
            }

            const content = await this.userService.signupUser(req.body.email, req.body.password);
            return this.json({
                error: null,
                data: content,
                message: "User registered successfully"
            }, 201);

        } catch (err) {
            return this.json({
                error:err.message,
                data: null,
                message: "Something went wrong"
            }, 403);
        }
    };
    @httpPost("/login")
    public async postLogin(req: Request, res: Response) {
        try {
            await check("email", "Email is not valid").isEmail().run(req);
            await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
            await check("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.json({
                    error: errors.array(),
                    data: null,
                    message: "Check errors to procced"
                }, 403);
            }
            const content = await this.userService.loginUser(req, res);
            const statusCode = 200;
            return this.json({
                error: null,
                data: content,
                message: "login success"
            }, statusCode);
        } catch (err) {
            const statusCode = 401;
            return this.json({
                error: null,
                data: null,
                message: err.message,
            }, statusCode);
        }
    };

    @httpGet("/logout")
    public async logoutUser(req: Request, res: Response) {
        try {
            const content = await this.userService.logoutUser(req, res);
            if (content)
                return this.json({
                    message: "Logout successfully"
                }, 200);
        } catch (err) {
            return res.send({
                error: err,
                message: "Logout failed"
            });
        }

    }
}
