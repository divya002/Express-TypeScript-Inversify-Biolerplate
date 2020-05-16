import {inject} from "inversify";
import { BaseHttpController,controller, httpGet, httpPost } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";
import { UserService} from "../services/user.service";
import TYPES from "../constants/types";
import { check, sanitize, validationResult } from "express-validator";
import { User, UserDocument, AuthToken } from "../models/User";
import logger from "../util/logger";

@controller("/user")
export class UserController extends BaseHttpController {
    constructor(@inject(TYPES.UserService) private userService: UserService){
        super();
    }
    @httpGet("/")
    public getUsers(req: Request, res: Response) {
        res.send({
            data: req.body
        });
    }

    /**
 * POST /signup
 * Create a new local account.
 */
@httpPost("/signup")
public async postSignup (req: Request, res: Response, next: NextFunction) {
    try{
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await check("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.send({ 
            data:errors.array(),
            message:"Check errors to procced"
        });
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { throw new Error(err); }
        if (existingUser) {
            logger.error("errors", { msg: "Account with that email address already exists." });
            res.send({
                data:null,
                message:"Account with that email address already exists."
            });
            return;
        }
        user.save((err) => {
            if (err) { return next(err); }
            res.send({ 
                data:user,
                message:"User has been registered"
            });
            return;
        });
    });
}catch(err){ 
    res.send({ 
        data:null,
        message:"Something went wrong"
    });
    return;
}
};
}

