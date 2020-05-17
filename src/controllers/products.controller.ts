import {inject} from "inversify";
import {BaseHttpController, controller, httpDelete, httpGet, httpPost, 
    httpPut,interfaces, injectHttpContext} from "inversify-express-utils";
import TYPES from "../constants/types";
import {ProductsService} from "../services/products.service";
import {JsonResult} from "inversify-express-utils/dts/results";
import {Request, Response, NextFunction} from "express";

@controller("/products",TYPES.LoggerMiddleware)
export class ProductsController extends BaseHttpController {
    constructor(@inject(TYPES.ProductsService) private productsService: ProductsService,
    @injectHttpContext private readonly  _httpContext: interfaces.HttpContext
    ) {
        super();
    }

    @httpGet("/",TYPES.AuthMiddleware)
    public async getProducts(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const token = this._httpContext.request.headers["postman-token"];
        console.log(token);
        const content = await this.productsService.getProducts();
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/:id")
    public async getProduct(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.productsService.getProduct(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpPost("/")
    public async createProduct(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.productsService.createProduct(req.body);
        const statusCode = 201;
        return this.json(content, statusCode);
    }

    @httpPut("/:id")
    public async updateProduct(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.productsService.updateProduct(req.params.id, req.body);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpDelete("/:id")
    public async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.productsService.deleteProduct(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }
}
