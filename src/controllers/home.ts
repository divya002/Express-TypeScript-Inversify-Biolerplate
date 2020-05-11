import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
    res.status(200).send({
        status: 200,
        title: "Home"
    });
};
