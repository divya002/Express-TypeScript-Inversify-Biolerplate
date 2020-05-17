import { injectable } from "inversify";
import { Request, Response } from "express";
import passport from "passport";
import { IVerifyOptions } from "passport-local";
import { User, UserDocument, AuthToken } from "../models/User";

import "../config/passport";


@injectable()
export class UserService {
    public get(): void {
        console.log("get");
    }
    public getUser(token: string): {} {
        console.log(token);
        return {
            tokens: [],
            _id: "5ebed5c522aa500ffeed1814",
            email: "divyaprakash002@gmail.com",
            createdAt: "2020-05-15T17:47:49.141Z",
            updatedAt: "2020-05-15T17:47:49.141Z"
        };
    }
    public loginUser(req: Request, res: Response): Promise<UserDocument> {
        return new Promise((resolve, reject) => {
            passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
                console.log(info);
                if (err) { throw new Error("error"); }
                if (!user) {
                    reject(new Error("No User Available"));
                }
                req.logIn(user, (err) => {
                    if (err) {
                        reject(new Error("Failed"));
                    }
                    resolve(user);
                });
            })(req, res);
        });
    }

    public logoutUser(req: Request, res: Response): Promise<boolean> {

        return new Promise((resolve, reject) => {
            req.session?.destroy((err) => {
                if (!err) {
                    req.logout();
                    resolve(true);
                }
                reject(new Error(err));
            });
        });
    }

    public signupUser(email: string,password: string): Promise<UserDocument>{

        const user = new User({
            email: email,
            password: password
        });
        return new Promise((resolve, reject)=>{
            User.findOne({ email: email }, (err, existingUser) => {
                if (err) { throw new Error(err); }
                if (existingUser) {
                    reject(new Error("duplicateUser"));
                }
                user.save((err) => {
                    if (err) { reject(new Error(err)); }
                    resolve(user);
                });
            });
        });
    }
}
