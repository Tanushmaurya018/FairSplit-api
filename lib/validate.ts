import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema, type ZodIssue } from "zod";

type Part = "body" | "query" | "params";
type Schemas = Partial<Record<Part, ZodSchema<any>>>;


export function validate(schemas: Schemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body)   req.body   = schemas.body.parse(req.body);
      if (schemas.query)  req.query  = schemas.query.parse(req.query);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((issue: ZodIssue) => ({
          path: issue.path.join("."),
          issue: issue.message,
          code: issue.code,
        }));
        return res.status(400).json({
          message: "Validation failed",
          errors: details,
        });
      }
      next(err);
    }
  };
}
