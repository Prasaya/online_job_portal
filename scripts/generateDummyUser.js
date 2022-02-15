/* eslint-disable function-call-argument-newline */
/* eslint-disable @typescript-eslint/no-var-requires */
const { randomUUID } = require('crypto');
const fs = require('fs');

function generateString() {
    const str = () => Math.random().toString(36);
    return str()
        .concat(str())
        .concat(str())
        .concat(str())
        .concat(str());
}

function generateUserValues() {
    const userValues = {
        uid: randomUUID(),
        email: `${generateString()}@gmail.com`.substring(0, 250),
        password: `${generateString()}${generateString()}`.substring(0, 60),
        firstName: generateString().substring(0, 50),
        middleName: generateString().substring(0, 50),
        lastName: generateString().substring(0, 50),
        picture: generateString().substring(0, 200),
        birthday: '2022-02-09',
        phone: generateString().substring(
            0,
            10,
        ),
        gender: generateString().substring(
            0,
            10,
        ),
    };
    return userValues;
}

function arrayToString(arr, quote = "'") {
    let str = '';
    arr.forEach((st, index, obj) => {
        str += `${quote}${st}${quote}`;
        if (index !== obj.length - 1) {
            str += ', ';
        }
    });
    return str;
}

function createUser(num) {
    let query = `SET autocommit = 0;\nSET unique_checks = 0;\nINSERT INTO users (${arrayToString(
        Object.keys(generateUserValues()),
        '',
    )}) VALUES \n\t`;
    for (let i = 0; i < num; i += 1) {
        query += `(${arrayToString(Object.values(generateUserValues()))})`;
        if (i !== num - 1) {
            query += ',\n\t';
        }
    }
    query += ';\nSET autocommit = 1;\nSET unique_checks = 1;\n';
    return query;
}

function generateFile() {
    const entries = 10;
    const query = createUser(entries);
    fs.writeFileSync('./dummyUser.sql', query);
}

generateFile();
