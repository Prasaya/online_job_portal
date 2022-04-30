import { getEnv } from '../services/Configuration/env';
import { DBConfig, QueryType } from '../services/DatabaseService/typings';
import { DatabaseService } from '../services/DatabaseService/databaseService';

describe('databaseService', () => {
  const config: DBConfig = {
    host: getEnv('DB_HOST'),
    port: parseInt(getEnv('DB_PORT', '3306'), 10),
    user: getEnv('DB_USER'),
    password: getEnv('DB_PASSWORD'),
    database: 'online_job_portal_test',
  };
  const databaseService = new DatabaseService(config);

  test('if connected', async () => {
    const pool = databaseService.getConnectionPool();
    const connection = await pool.getConnection();
    expect(connection).toBeDefined();
  });

  test('execute describe query', async () => {
    const result = await databaseService.executeQuery(
      'describe auth;',
      [],
      QueryType.DESCRIBE,
    );
    expect(result.length).toBeGreaterThan(0);
  });

  test('execute select query', async () => {
    const query = 'select count(qid) as count from academic_qualifications';
    const rows = await databaseService.executeQuery(
      query,
      [],
      QueryType.SELECT,
    );
    expect(rows.length).toBe(1);
    expect(rows[0].count).toBeDefined();
    expect(rows[0].count).toBeGreaterThan(0);
  });

  test('with wrong query type', async () => {
    const query = 'select count(qid) as count from academic_qualifications';
    await expect(
      async () => await databaseService.executeQuery(query, [], QueryType.CALL),
    ).rejects.toThrow();
  });

  test('execute procedure without return', async () => {
    const values = [
      '123',
      'test@test',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    const query = 'call createApplicant(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const result = await databaseService.executeQuery(
      query,
      values,
      QueryType.CALL,
    );
    expect(result.length).toBe(2);
    expect(result[0].length).toBe(0);
    expect(result[1].constructor.name).toBe('ResultSetHeader');
    expect(true).toBe(true);
  });

  test('execute procedure with return', async () => {
    const query = 'call getUserData(?)';
    const values = ['123'];
    const result = await databaseService.executeQuery(
      query,
      values,
      QueryType.CALL,
    );
    expect(result.length).toBe(2);
    expect(result[0].length).toBe(1);
    expect(result[0][0].id).toBe('123');
    expect(result[1].constructor.name).toBe('ResultSetHeader');
  });

  test('execute delete', async () => {
    const result = await databaseService.executeQuery(
      'delete from auth where id = "123"',
      [],
      QueryType.DELETE,
    );
    expect(result.affectedRows).toBe(1);
    expect(result.constructor.name).toMatch('ResultSetHeader');

    const newRows = await databaseService.executeQuery(
      'Select * from auth where id="123"',
      [],
      QueryType.SELECT,
    );
    expect(newRows.length).toBe(0);
  });

  test('end connection', async () => {
    await databaseService.end();
    const pool = databaseService.getConnectionPool();
    await expect(pool.getConnection()).rejects.toThrow();
  });
});
