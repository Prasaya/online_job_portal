import { createPool } from 'mysql2';
import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import {
  DBConfig,
  ExecuteReturnType,
  IDatabaseService,
  QueryType,
  ResolveQueryType,
} from './typings';

export class DatabaseService implements IDatabaseService {
  private _config: DBConfig;
  private _pool: Pool;

  constructor(config: DBConfig) {
    this._config = config;
    this._pool = createPool(this._config).promise();
  }

  /**
   * Getter function for mysql2 pool
   *
   * Should not be required for most cases
   * @returns Pool object
   */
  public getConnectionPool() {
    return this._pool;
  }

  /**
   * Executes query and returns the result
   *
   * Value of _type could be determined based on first word of query but it not implemented
   * because it would not provide compile time check.
   * @param query Query to execute
   * @param values Values to bind to query
   * @param _type Type of query to resolve return type
   * @returns Set of resovled rows of type ResolveQueryType<T>
   */
  public async executeQuery<T extends QueryType>(
    query: string,
    values: Array<any>,
    _type: T,
  ): Promise<ResolveQueryType<T>> {
    const connection = await this._pool.getConnection();
    const [rows] = await connection.execute(query, values);
    connection.release();
    return this.resolve(rows, _type);
  }

  public async end() {
    await this._pool.end();
  }

  /**
   * Dynamically check type of query and also typecheck for compile time autocomplete
   *
   * Since the structure of result of mysql2 execute may be different, compile time validation
   * is not sufficient. This method is not exhaustive but works for cases covered in this project.
   *
   * @param rows Return value from node-mysql execute
   * @param _type Enum of QueryType to resolve the return type
   * @returns Resolved type
   */
  private resolve<T extends QueryType>(
    rows: ExecuteReturnType,
    _type: T,
  ): ResolveQueryType<T> {
    const resolved = rows;
    switch (_type) {
      case QueryType.DESCRIBE:
        if (!Array.isArray(resolved)) {
          throw new Error('DESCRIBE query should have returned an array');
        }
        break;
      case QueryType.SELECT:
        if (!Array.isArray(resolved)) {
          throw new Error('DROP query should have returned an array');
        }
        break;
      case QueryType.CALL:
        if (
          !Array.isArray(resolved) ||
          resolved.length === 0 ||
          !Array.isArray(resolved[0])
        ) {
          // Procedure calls without return values return ResultSetHeader
          // Modify it to return [RowDataPacket[], ResultSetHeader] for consistency
          if (resolved.constructor.name === 'ResultSetHeader') {
            return [
              [] as RowDataPacket[],
              resolved as ResultSetHeader,
            ] as ResolveQueryType<T>;
          }
          throw new Error(
            `CALL query should have returned an array of arrays ${resolved}`,
          );
        }
        break;
    }
    return resolved as ResolveQueryType<T>;
  }
}
