import { Handler } from 'express';
import { checkSchema, Schema, validationResult } from 'express-validator';

const schemaHandler =
  (schema: Schema): Handler =>
  async (req, res, next) => {
    const temp = await checkSchema(schema).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false });
    }
    next();
  };

export default schemaHandler;
