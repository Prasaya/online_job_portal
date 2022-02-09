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

function generateCompanyValues() {
    const userValues = {
        cid: randomUUID(),
        email: `${generateString()}@gmail.com`.substring(0, 250),
        password: `${generateString()}${generateString()}`.substring(0, 60),
        name: generateString().substring(0, 100),
        description: generateString(),
        address: generateString().substring(0, 200),
        city: generateString().substring(0, 100),
        website: generateString().substring(0, 100),
        phone: generateString().substring(
            0,
            10,
        ),
        logo: generateString().substring(
            0,
            100,
        ),
    };
    return userValues;
}

function arrayToString(arr, quote = "'") {
    let str = '';
    arr.forEach((st, index, obj) => {
        str += `${quote}${st}${quote}`;
        if (index !== (obj.length - 1)) {
            str += ', ';
        }
    });
    return str;
}

function createCompany(num) {
    let query = `SET autocommit = 0;\nSET unique_checks = 0;\nINSERT INTO companies (${arrayToString(
        Object.keys(generateCompanyValues()),
        '',
    )}) VALUES \n\t`;
    for (let i = 0; i < num; i += 1) {
        query += `(${arrayToString(Object.values(generateCompanyValues()))})`;
        if (i !== (num - 1)) {
            query += ',\n\t';
        }
    }
    query += ';\nSET autocommit = 1;\nSET unique_checks = 1;\n';
    return query;
}

function generateFile() {
    const entries = 10;
    const query = createCompany(entries);
    fs.writeFileSync('./dummyCompany.sql', query);
}

generateFile();
