import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';
import { Pool, PoolOptions } from 'mysql2/promise';

export interface DBConfig extends PoolOptions {
  host: string;
  user: string;
  port: number;
  password: string;
  database: string;
}

export enum QueryType {
  CREATE,
  DELETE,
  DESCRIBE,
  DROP,
  INSERT,
  SELECT,
  UNKNOWN,
  UPDATE,
  CALL,
}

export type ExecuteReturnType =
  | RowDataPacket[][]
  | RowDataPacket[]
  | OkPacket
  | OkPacket[]
  | ResultSetHeader;

export type ResolveQueryType<Q extends QueryType> = Q extends QueryType.CREATE
  ? ResultSetHeader
  : Q extends QueryType.DELETE
  ? ResultSetHeader
  : Q extends QueryType.DESCRIBE
  ? RowDataPacket[]
  : Q extends QueryType.DROP
  ? ResultSetHeader
  : Q extends QueryType.INSERT
  ? ResultSetHeader
  : Q extends QueryType.SELECT
  ? RowDataPacket[]
  : Q extends QueryType.UNKNOWN
  ? ExecuteReturnType
  : Q extends QueryType.UPDATE
  ? ResultSetHeader
  : Q extends QueryType.CALL
  ? [Array<RowDataPacket>, ResultSetHeader]
  : never;

export interface IDatabaseService {
  config: DBConfig;
  pool: Pool;
  getConnectionPool(): Pool;
  executeQuery<T extends QueryType>(
    query: string,
    values: Array<any>,
    _type: T,
  ): Promise<ResolveQueryType<T>>;
}
