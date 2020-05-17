const TYPES = {
    HomeService: Symbol.for("HomeService"),
    ProductsService: Symbol.for("ProductsService"),
    UserService: Symbol.for("UserService"),
    Logger: Symbol.for("Logger"),
    LoggerMiddleware: Symbol.for("LoggerMiddleware"),
    AuthMiddleware: Symbol.for("AuthMiddleware"),
};

export default TYPES;
