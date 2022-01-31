import '../src/env';
import getRoles from '../src/utils/authorization';

test('testRoles', async () => {
    const res = await getRoles();
    expect(res).toStrictEqual([
        { roleName: 'Administrators' },
        { roleName: 'Employers' },
        { roleName: 'Applicants' },
        { roleName: 'Users' },
    ]);
});
