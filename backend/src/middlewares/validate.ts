import { ZodSchema} from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema : ZodSchema) => (req : Request, res : Response, next : NextFunction) : void => {
    try{
        schema.parse({ body : req.body, query : req.query, params : req.params})
        next()

    }catch (error : unknown){
        res.status(400).json({
            message: error || "validation error",
        })
    }
}