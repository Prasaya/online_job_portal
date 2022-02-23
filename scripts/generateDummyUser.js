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

const password = "Apples123"
function generateUserValues() {
    const userValues = {
        uid: randomUUID(),
        email: `${generateString()}@gmail.com`.substring(0, 100),
        password: password,
        firstName: 'fName',
        middleName: 'mName',
        lastName: 'lName',
        picture: 'picture',
        birthday: '2022-02-09',
        phone: '012123176',
        gender: 'M',
    };
    return userValues;
}

const uid = [];
function createUser(num) {
    let query = `SET autocommit = 0;\nSET unique_checks = 0;\n`
    let query2 = `SET autocommit = 0;\nSET unique_checks = 0;\n`
    // let query3 = `SET autocommit = 0;\nSET unique_checks = 0;\n`
    // let query4 = `SET autocommit = 0;\nSET unique_checks = 0;\n`
    query += 'INSERT INTO auth (id, email, password, type) VALUES\n\t';
    query2 += 'INSERT INTO applicant_data (id, firstName, middleName, lastName, picture, birthday, phone,gender) VALUES\n\t'
    // query3 += 'INSERT INTO applicant_skills (id, name, proficiency, experience) VALUES\n\t'
    // query4 += 'INSERT INTO applicant_academics (id, qid) VALUES \n\t'
    for (let i = 0; i < num; i += 1) {
        const user = generateUserValues();
        uid.push(user.uid);
        query += `('${user.uid}', '${user.email}', '${user.password}', 'Users')`;
        query2 += `('${user.uid}', '${user.firstName}', '${user.middleName}', '${user.lastName}', '${user.picture}', '${user.birthday}', '${user.phone}', '${user.gender}')`
        // for (let j=0; j < 5; j++) {
        //     const skill = generateString().substring(0, 20);
        //     const proficiency = ["Beginner", "Intermediate", "Advanced", "Expert"][Math.floor(Math.random() * 4)]
        //     query3 += `('${user.uid}', '${skill}', '${proficiency}', '${Math.floor(Math.random() * 20) + 1}')`
        //     if (j !== 4) {
        //         query3 += ',\n\t';
        //     }
        // }
        // for (let j=0; j < 5; j++) {
        //     query4 += `('${user.uid}', '${Math.floor(Math.random()*500 + 1)}')`
        //     if (j !== 4) {
        //         query4 += ',\n\t';
        //     }
        // }
        if (i !== num - 1) {
            query += ',\n\t';
            query2 += ',\n\t';
            // query3 += ',\n\t';
            // query4 += ',\n\t';
        }
    }
    query += ';\nSET autocommit = 1;\nSET unique_checks = 1;\n';
    query2 += ';\nSET autocommit = 1;\nSET unique_checks = 1;\n';
    // query3 += ';\nSET autocommit = 1;\nSET unique_checks = 1;\n';
    // query4 += ';\nSET autocommit = 1;\nSET unique_checks = 1;\n';
    fs.writeFileSync('./f1.sql', query)
    fs.writeFileSync('./f2.sql', query2)
    // fs.writeFileSync('./f3.sql', query3)
    // fs.writeFileSync('./f4.sql', query4)
    return query + '\n\n\n' + query2
}

function insertSkills(num) {
    let query = `SET autocommit = 0;\nSET unique_checks = 0;\n`
    query += 'INSERT INTO applicant_skills (id, name, proficiency, experience) VALUES\n\t'
    for (let i = 0; i < num; i += 1) {
        for (let j=0; j < 5; j++) {
            const skill = generateString().substring(0, 20);
            const proficiency = ["Beginner", "Intermediate", "Advanced", "Expert"][Math.floor(Math.random() * 4)]
            query += `('${uid[i]}', '${skill}', '${proficiency}', '${Math.floor(Math.random() * 20) + 1}')`
            if (j !== 4) {
                query += ',\n\t';
            }
        }
        if (i !== num - 1) {
            query += ',\n\t';
        }
    }
    query += ';\nSET autocommit = 1;\nSET unique_checks = 1;\n';
    fs.writeFileSync('./f3.sql', query)
}

function insertAcademics(num) {
    let query4 = `SET autocommit = 0;\nSET unique_checks = 0;\n`
    query4 += 'INSERT INTO applicant_academics (id, qid) VALUES \n\t'
    for (let i = 0; i < num; i += 1) {
        const qids = [];
        for (let j=0; j < 5; j++) {
            const qid = Math.floor(Math.random()*500 + 1);
            if (qids.includes(qid)) {
                j--;
                continue;
            }
            qids.push(qid);
            query4 += `('${uid[i]}', '${qid}')`
            if (j !== 4) {
                query4 += ',\n\t';
            }
        }
        if (i !== num - 1) {
            query4 += ',\n\t';
        }
    }
    query4 += ';\nSET autocommit = 1;\nSET unique_checks = 1;\n';
    fs.writeFileSync('./f4.sql', query4)
}

function generateFile() {
    const entries = 10;
    createUser(entries);
    insertSkills(entries);
    insertAcademics(entries);
}

generateFile();
