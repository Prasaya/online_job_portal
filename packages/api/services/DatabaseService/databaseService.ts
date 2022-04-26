import { createPool } from 'mysql2';
import { Pool } from 'mysql2/promise';
import {
  DBConfig,
  ExecuteReturnType,
  IDatabaseService,
  QueryType,
  ResolveQueryType,
} from './typings';

export class DatabaseService implements IDatabaseService {
  config: DBConfig;
  pool: Pool;

  constructor(config: DBConfig) {
    this.config = config;
    this.pool = createPool(config).promise();
  }

  public getConnectionPool() {
    return this.pool;
  }

  public async executeQuery<T extends QueryType>(
    query: string,
    values: Array<any>,
    _type: T,
  ): Promise<ResolveQueryType<T>> {
    const [rows] = await this.pool.execute(query, values);
    return this.resolve(rows, _type);
  }

  private resolve<T extends QueryType>(
    rows: ExecuteReturnType,
    _type: T,
  ): ResolveQueryType<T> {
    const resolved = rows as ResolveQueryType<T>;
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
          throw new Error('CALL query should have returned an array of arrays');
        }
        break;
    }
    return resolved;
  }
}
