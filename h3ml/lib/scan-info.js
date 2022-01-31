const Module  = '/h3ml/lib/scan-info.js';
const Version = '0.3.2.23'; // update this every time when edit the code!!!

import {Constants}  from "/h3ml/lib/constants.js";
import {Logger}     from "/h3ml/lib/log.js";
import {Servers}    from "/h3ml/lib/server-list.js";

async function version(ns, port) {
    if (port !== undefined && port) {
        const data = ns.sprintf("%d|%s|%s", Date.now(), Module, Version);
        return ns.tryWritePort(port, data);
    }
    ns.tprintf("version %s", Version);
    return;
}

/**
    @param {NS} ns
    @param {Number} port
**/
function help(ns) {
    ns.tprintf("usage: %s --version [--update-port] | --help", Module);
    ns.tprintf("scan servers and output as tree with info");
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

    const l = new Logger(ns, {args: args});
    l.g(1, "%s %s", Module, Version);


    const rootKits = ns.ls('home').filter(f => Constants.rootKitFiles[f]).length;

    Server.tree(ns, (pad, server) => {
        const hackable = ns.getHackingLevel() > ns.getServerRequiredHackingLevel(server.name) ? 1 : 0
        const rootable = rootKits >= ns.getServerNumPortsRequired(server.name) ? 1 : 0;
        const rooted   = ns.hasRootAccess(server.name) ? "🞕" : rootable ? "🞖" : "🞎";
        const hacked   = ns.getServer().backdoorInstalled == true ? "🞕" : hackable ? "🞖" : "🞎";

        const moneyAvail = moneyFormat(ns.getServerMoneyAvailable(name));
        const moneyMax   = moneyFormat(ns.getServerMaxMoney(name));

        const info = [
            "[",    ns.getServerRequiredHackingLevel(name),
            ", ",   ns.getServerNumPortsRequired(name),     "]",
            " ",    ns.getServerUsedRam(name),
            "/ ",   ns.getServerMaxRam(name),               " Gb",
            "$ ",   round(moneyAvail.amount, 2), moneyAvail.unit,
            " / ",  round(moneyMax.amount, 2), moneyMax.unit,
            " (",   moneyMax ? round((100 * moneyAvail.value / moneyMax.value), 2) : 0,
            "%)"
        ].join("");

        ns.tprintf("%s %s %s %s %s", pad, rooted, hacked, server.name, info);
    });

}
