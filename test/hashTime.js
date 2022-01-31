const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { performance } = require('perf_hooks');

function hashPassword (password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const iterations = 300000;
    const keylen = 64;
    const digest = 'sha512';
    const hash = crypto
        .pbkdf2Sync(password, salt, iterations, keylen, digest)
        .toString();
    return hash;
}

async function hashBcrypt (password) {
    const saltRounds = 13;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

function timeFunction (fn, iterations = 100) {
    let total = 0;
    let max = 0;
    let min = 0;
    for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        fn();
        const endTime = performance.now();
        const timeTaken = endTime - startTime;
        total += timeTaken;
        max = Math.max(max, timeTaken);
        min = Math.min(min, timeTaken);
    }
    console.log(`Total time: ${total}`);
    console.log(`Min time: ${min}`);
    console.log(`Max time: ${max}`);
    console.log(`Average time: ${total / iterations}`);
}

const iterations = 1;
// timeFunction(() => {
//     return hashPassword('Savior-Repave9-Creamed-Chomp-Earplugs');
// }, iterations);

for (let i = 0; i < iterations; i++) {
    hashBcrypt('Savior-Repave9-Creamed-Chomp-Earplugs')
        .then((hash) => {
            console.log(hash);
        });
}
