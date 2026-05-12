import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

/**
 * Different from Module 12's generic handler, modified to support type-safe `req.params`
 * via the generic type `P` (e.g., `{ id: string }`), to remove unsafe
 * manual parameter extraction or type assertions.
 * 
 * @example
 * asyncHandler (async (req: Result<{ id: string }>, res) => {
 *   const userId = parseInt(req.params.id); // Type-safe
 * })
 */
export function asyncHandler<P = ParamsDictionary>(
  fn: (
    req: Request<P>,
    res: Response,
    next: NextFunction,
  ) => Promise<void | Response>,
) {
  return (req: Request<P>, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => {
      // Since Exercise 13.3 explicitly states that all try catch in every handler must be removed,                                                   
      // Moved the error code for the P2025 in PUT /:id and DELETE /:id here.                                                                         
      // If not added, app will just return a generic 500 error instead of the specific 404 error.
      if (err?.code === 'P2025') {
        return res.status(404).json({ error: { status: 404, message: 'Not found' } });
      }
      next(err);
    });
  };
}
