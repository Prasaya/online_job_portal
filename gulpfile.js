const gulp = require('gulp');
const { series, parallel } = require('gulp');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const spawn = require('child_process').spawn;

const env = process.env.NODE_ENV || 'development';
console.log(`Using environment: ${env}`);

function runCommand (command, args, {
    errorCallback, closeCallback, name, cwd,
}) {
    const child = spawn(command, args, { cwd: cwd || '.', shell: true });
    child.on('error', (err) => {
        process.stderr.write(`Error in ${name}: ${err}\n`);
        errorCallback(err);
    });
    child.on('close', (code, signal) => {
        process.stdout.write(`${name} exited with code ${code} and signal ${signal}\n`);
        closeCallback(code, signal);
    });
    child.stdout.on('data', (data) => {
        process.stdout.write(`${name}: ${data}`);
    });
    child.stderr.on('data', (data) => {
        process.stderr.write(`${name}-err: ${data}`);
    });
}

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
    const name = 'Server';
    const errorCallback = cb;
    const closeCallback = (code, signal) => {
        return cb();
    };
    if (env === 'production') {
        runCommand(
            'node',
            ['./dist/backend.cjs'],
            {
                name,
                errorCallback,
                closeCallback,
            }
        );
    } else {
        runCommand(
            'yarn',
            [
                'run',
                'nodemon',
                '--watch',
                './dist/backend.cjs',
                './dist/backend.cjs',
            ],
            {
                name,
                errorCallback,
                closeCallback,
            }
        );
    }
}

const server = env === 'production'
    ? series(backendBuild, backendStart)
    : series(backendBuild, parallel(backendStart, watch));

function clientBuild (cb) {
    const name = 'Client';
    const errorCallback = cb;
    const closeCallback = (code, signal) => {
        runCommand('cp', [
            '-rf',
            'build/.',
            '../../dist/public',
        ], {
            name: 'Client-copy', 
            errorCallback,
            closeCallback: (code, signal) => {
                return cb();
            },
            cwd: './src/client',
        });
    };
    runCommand(
        'mkdir',
        ['-p', 'dist'],
        {
            name: 'mkdir',
            closeCallback: () => {},
            errorCallback: cb,
        }
    );
    runCommand(
        'yarn',
        ['build'],
        {
            name,
            errorCallback,
            closeCallback,
            cwd: './src/client',
        }
    );
}

function clientStart (cb) {
    const name = 'Client';
    const errorCallback = (err) => {
        return cb(err);
    };
    const closeCallback = (code, signal) => {
        return cb();
    };
    runCommand(
        'yarn',
        ['start'],
        {
            name,
            errorCallback,
            closeCallback,
            cwd: './src/client',
        }
    );
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

exports.buildServer = backendBuild;
exports.buildClient = clientBuild;
exports.build = parallel(backendBuild, clientBuild);
exports.server = server;
exports.client = client;
exports.start = parallel(server, client);
