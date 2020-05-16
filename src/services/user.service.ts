import { injectable } from "inversify";

@injectable()
export class UserService {
    public get(): void {
        console.log("get");
    }
    public getUser(token: string): string {
        console.log(token);
        return "Divyaprakash";
    }
}
