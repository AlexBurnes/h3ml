const Module  = '/h3ml/lib/units.js';
const Version = '0.3.5.2'; // update this every time when edit the code!!!

import {Constants}  from "/h3ml/lib/constants.js";

class _Units {
    constructor() {
        if (!_Units._instance) {
            _Units._instance = this
        }
        return _Units._instansce;
    }
    money(value) {
        return moneyFormat(value);
    }
    time(value) {
        return timeFormat(value);
    }
    size(value) {
        return sizeFormat(value);
    }
}
export const Units = new _Units();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// sizeFormat

const memoryUnits = ['b', 'k', 'M', 'G', 'T', 'P'];

class SizeFormatted {
    constructor(value, size, unit) {
        this.value = value;
        this.size  = size;
        this.unit  = unit;
    }
    valueOf() {return this.value};
    pretty(ns) {return ns.sprintf("%.2f%s", this.size, this.unit);}
}

export function sizeFormat(size) {
    const value = size;
    size = size;
    let unit = 0;
    const base = 1024;
    if (parseFloat(size) == "Infinity") return new SizeFormatted(0, 0, 'b');
    while (++unit < memoryUnits.length && Math.abs(size) >= base) size /= base;
    return new SizeFormatted(value, value >= 0 ? size : -size, memoryUnits[unit]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// moneyFormat

const moneyUnits   = ['',  'k', 'm', 'b', 't', 'q'];

class MoneyFormatted {
    constructor(value, amount, unit) {
        this.value  = value;
        this.amount = amount;
        this.unit   = unit
    }
    valueOf() {return this.value};
    pretty(ns) {return ns.sprintf("%.2f%s", this.amount, this.unit);}
}

export function moneyFormat(amount) {
    const value = amount;
    let unit = 0;
    const base = 1000;
    if (parseFloat(amount) == "Infinity") return new MoneyFormatted(0, 0, '');
    while (++unit < moneyUnits.length && Math.abs(amount) >= base) amount /= base;
    return new MoneyFormatted(value, amount, moneyUnits[unit-1]);
}

const timeUnits = ['s', 'm', 'h', 'D', 'M', 'Y'];
const timeBases = [60,  60,  60,  24,  30,  12];

class TimeFormatted {
    constructor(value, time, unit) {
        this.value = value;
        this.time = time;
        this.unit = unit;
    }
    valueOf() {return this.value};
    pretty(ns) {return ns.sprintf("%.2f%s", this.time, this.unit);}
}

export function timeFormat(time) {
    const value = time;
    let unit = 0;
    if (parseFloat(time) == "Infinity") return new TimeFormatted(0, 0, 's');
    while (++unit < timeUnits.length && Math.abs(time) >= timeBases[unit-1]) time /= timeBases[unit-1];
    return new TimeFormatted(value, time, timeUnits[unit-1]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// update support
/**
    @param {NS} ns
    @param {Number} port
**/
async function version(ns, port) {
    if (port !== undefined && port) {
        const data = ns.sprintf("%d|%s|%s", Date.now(), Module, Version);
        return ns.tryWritePort(port, data);
    }
    ns.tprintf("module %s version %s", Module, Version);
    return;
}

function help(ns) {
    ns.tprintf("usage: %s --version [--update-port] | --help", Module);
    ns.tprintf("this module is a library, import {some} from '%s'", Module); // in case of a library
    return;
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([
        [ 'version'     , false ],
        [ 'update-port' , 0     ],
        [ 'help'        , false ]
    ]);

    if (args['version']) {
        return version(ns, args['update-port']);
    }
    if (args['help']) {
        return help(ns);
    }
    help();
    return;
}
