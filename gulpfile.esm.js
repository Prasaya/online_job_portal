import gulp from 'gulp';
import { spawn } from 'child_process';
import webpack from 'webpack';
import webpackConfig from './webpack.config.mjs';

const env = process.env.NODE_ENV || 'development';
process.stdout.write(`Using environment: ${env}\n`);

function runCommand(command, args, { errorCallback, closeCallback, name, cwd }) {
    const child = spawn(
        command,
        args,
        { cwd: cwd || '.', shell: true },
    );
    child.on(
        'error',
        (err) => {
            process.stderr.write(`Error in ${name}: ${err}\n`);
            if (errorCallback) {
                errorCallback(err);
            }
        },
    );
    child.on(
        'close',
        (code, signal) => {
            process.stdout.write(`${name} exited with code ${code} and signal ${signal}\n`);
            if (closeCallback) {
                closeCallback(
                    code,
                    signal,
                );
            }
        },
    );
    child.stdout.on(
        'data',
        (data) => {
            process.stdout.write(`${name}: ${data}`);
        },
    );
    child.stderr.on(
        'data',
        (data) => {
            process.stderr.write(`${name}-err: ${data}`);
        },
    );
}

function backendBuild() {
    return new Promise((resolve, reject) => {
        webpack(
            webpackConfig,
            (err, stats) => {
                if (err) {
                    return reject(err);
                }
                if (stats.hasErrors()) {
                    return reject(new Error(stats.compilation.errors.join('\n')));
                }
                return resolve();
            },
        );
    });
}

function backendStart(cb) {
    const name = 'Server';
    const errorCallback = cb;
    const closeCallback = () => cb();
    if (env === 'production') {
        runCommand(
            'node',
            ['./dist/backend.cjs'],
            {
                name,
                errorCallback,
                closeCallback,
            },
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
            },
        );
    }
}

function watchFiles() {
    process.stdout.write('Starting watch\n');
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
        backendBuild,
    );
}

const server = env === 'production'
    ? gulp.series(
        backendBuild,
        backendStart,
    )
    : gulp.series(
        backendBuild,
        gulp.parallel(
            backendStart,
            watchFiles,
        ),
    );

function clientBuild(cb) {
    const name = 'Client';
    const errorCallback = cb;
    const closeCallback = () => {
        runCommand(
            'cp',
            [
                '-rf',
                'build/.',
                '../../dist/public',
            ],
            {
                name: 'Client-copy',
                errorCallback,
                closeCallback: () => cb(),
                cwd: './src/client',
            },
        );
    };
    runCommand(
        'mkdir',
        [
            '-p',
            'dist',
        ],
        {
            name: 'mkdir',
            // yarn build should be here as close callback but practically it's not needed
            // as build is generally much slower than mkdir
            errorCallback: cb,
        },
    );
    runCommand(
        'yarn',
        ['build'],
        {
            name,
            errorCallback,
            closeCallback,
            cwd: './src/client',
        },
    );
}

function clientStart(cb) {
    const name = 'Client';
    const errorCallback = (err) => cb(err);
    const closeCallback = () => cb();
    runCommand(
        'yarn',
        ['start'],
        {
            name,
            errorCallback,
            closeCallback,
            cwd: './src/client',
        },
    );
}

const client = env === 'production'
    ? clientBuild
    : clientStart;
const build = gulp.parallel(
    backendBuild,
    clientBuild,
);
const start = gulp.parallel(
    server,
    client,
);

export {
    backendBuild as buildServer,
    clientBuild as buildClient,
    build,
    server,
    client,
    start,
};

// module.exports = {
//     buildServer: backendBuild,
//     buildClient: clientBuild,
//     build,
//     server,
//     client,
//     start,
// };
