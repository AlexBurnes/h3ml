// update.js
// version 0.1.4

const baseUrl      = 'https://raw.githubusercontent.com/AlexBurnes/btbsjs/master/';
const fileList     =  "file-list.js";
const updateScript =  "update-fetch.js";

/** @param {import("Ns").NS } ns */
export async function main(ns) {
    await update(ns);
}

/** @param {import("Ns").NS } ns */
async function update(ns) {
    const host = ns.getHostname();
    await ns.wget(`${baseUrl}${fileList}`, fileList);
    if (!ns.fileExists(fileList, host)) {
        ns.tprintf("failed get file list for update, %s/%s", baseUrl, fileList);
        return;
    }

    await ns.wget(`${baseUrl}${updateScript}`, updateScript);
    if (!ns.fileExists(updateScript, host)) {
        ns.tprintf("failed get update-fetch script, %s/%s", baseUrl, updateScript);
        return;
    }
    ns.tprint('Done updating!');
}
