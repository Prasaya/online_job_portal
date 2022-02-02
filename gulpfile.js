const gulp = require('gulp');
const { series, parallel } = require('gulp');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const spawn = require('child_process').spawn;

const env = process.env.NODE_ENV || 'development';
console.log(`Using environment: ${env}`);

function backendBuild (cb) {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                return reject(err);
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')));
            }
            resolve();
        });
    });
}

function backendStart (cb) {
    const command = env === 'production'
        ? 'node ./dist/backend.cjs'
        : 'nodemon --watch ./dist/backend.cjs ./dist/backend.cjs';
    const child = spawn(command, { shell: true });
    child.on('error', (err) => {
        process.stderr.write(`Could not start backend: ${err}`);
        cb(err);
    });
    child.on('exit', (code, signal) => {
        process.stdout.write(`Server exited with code ${code} and signal ${signal}`);
        cb();
    });
    child.stdout.on('data', (data) => {
        process.stdout.write(`server: ${data}`);
    });
    child.stderr.on('data', (data) => {
        process.stderr.write(`server-err: ${data}`);
    });
}

const server = env === 'production'
    ? series(backendBuild, backendStart)
    : series(backendBuild, parallel(backendStart, watch));

async function clientBuild (cb) {
    const command = 'cd src/client && yarn build  && cp -rf build/. ../../dist/public/ && cd ../..';
    const child = spawn(command, { shell: true });
    child.on('error', (err) => {
        process.stderr.write(`Could not start client: ${err}`);
        cb(err);
    });
    child.on('exit', (code, signal) => {
        process.stdout.write(`Client exited with code ${code} and signal ${signal}`);
        cb();
    });
    child.stdout.on('data', (data) => {
        process.stdout.write(`client: ${data}`);
    });
    child.stderr.on('data', (data) => {
        process.stderr.write(`client-err: ${data}`);
    });
}
async function clientStart (cb) {
    const command = 'cd ./src/client && yarn run start && cd ../..';
    const child = spawn(command, { shell: true });
    child.on('error', (err) => {
        process.stderr.write(`Could not start client: ${err}`);
        cb(err);
    });
    child.on('exit', (code, signal) => {
        process.stdout.write(`Client exited with code ${code} and signal ${signal}`);
        cb();
    });
    child.stdout.on('data', (data) => {
        process.stdout.write(`client: ${data}`);
    });
    child.stderr.on('data', (data) => {
        process.stderr.write(`client-err: ${data}`);
    });
}

const client = env === 'production' ? clientBuild : clientStart;

function watch (cb) {
    process.stdout.write('Starting watch');
    return gulp.watch(
        '**/**',
        {
            ignored: [
                './src/client',
                './src/public',
                './dist',
                './node_modules',
            ],
        },
        backendBuild
    );
}

exports.server = server;
exports.client = client;
exports.start = parallel(server, client);
