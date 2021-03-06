const Module  = '/h3ml/bin/rm.js';
const Version = '0.3.2.29'; // update this every time when edit the code!!!

import {Constants}  from "/h3ml/lib/constants.js";
import {Logger}     from "/h3ml/lib/log.js";

async function version(ns, port) {
    if (port !== undefined && port) {
        const data = ns.sprintf("%d|%s|%s", Date.now(), Module, Version);
        return ns.tryWritePort(port, data);
    }
    ns.tprintf("module %s version %s", Module, Version);
    return;
}

/**
    @param {NS} ns
    @param {Number} port
**/
function help(ns) {
    ns.tprintf("usage: %s pattern [host] | --version [--update-port] | --help", Module);
    ns.tprintf("delete files with names like regex pattern on host");
    return;
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([
        [ 'version'     , false ],
        [ 'update-port' , 0     ],
        [ 'help'        , false ],
        [ 'log'         , 1     ], // log level - 0 quiet, 1 and more verbose
        [ 'debug'       , 0     ], // debug level
        [ 'verbose'     , true  ], // verbose mode, short analog of --log-level 1
        [ 'quiet'       , false ]  // quiet mode, short analog of --log-level 0

    ]);

    if (args['version']) {
        return version(ns, args['update-port']);
    }
    if (args['help']) {
        return help(ns);
    }

    // for modules
    const l = new Logger(ns, {args: args});


    const [filter, host = ns.getHostname()] = args["_"];

    if (filter == undefined) {
        l.g(1, "usage: rm pattern [host]");
        return;
    }

    const re = new RegExp(filter);

    ns.ls(host)
        .filter(file => file.match(re))
        .forEach(file => {
            ns.rm(file, host);
            if (ns.fileExists(file, host)) {
                l.g(1, "failed rm %s", file);
            }
            else {
                l.g(1, "rm %s", file);
            }
        });
}

// FIXME autocomplite for second argument
