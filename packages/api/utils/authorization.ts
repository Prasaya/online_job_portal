// @ts-nocheck

import { Role } from '@typings/authorization';
import connection from './dbSetup';

// eslint-disable-next-line import/no-mutable-exports
let cachedRoles: Role[];
async function getRoles() {
  if (cachedRoles !== undefined) {
    return cachedRoles;
  }
  const [result] = await connection.query('SELECT * FROM roles');
  return result as Role[];
}
// (async () => {
//   cachedRoles = await getRoles();
// })();

export function getRoleById(id: number): Promise<Role | null> {
  return getRoles().then(
    (roles) => roles.find((role) => role.roleId === id) || null,
  );
}

export function getRoleByName(name: string): Promise<Role | null> {
  return getRoles().then(
    (roles) => roles.find((role) => role.roleName === name) || null,
  );
}

export default cachedRoles;
