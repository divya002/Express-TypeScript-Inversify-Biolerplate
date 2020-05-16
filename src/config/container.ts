import { HomeService } from "../services/home.service";
import { Container } from "inversify";
import { ProductsService } from "../services/products.service";
import { UserService } from "../services/user.service";
import {Logger} from "../util/logger";
import TYPES from "../constants/types";
import {LoggerMiddleware} from "../policies/logger.Middleware";

export class ContainerConfigLoader {
    public static Load(): Container {
        const container = new Container();
        container.bind<HomeService>(TYPES.HomeService).to(HomeService);
        container.bind<ProductsService>(TYPES.ProductsService).to(ProductsService);
        container.bind<UserService>(TYPES.UserService).to(UserService);
        container.bind<Logger>(TYPES.Logger).to(Logger);
        container.bind<LoggerMiddleware>(TYPES.LoggerMiddleware).to(LoggerMiddleware);
        return container;
    }
}
