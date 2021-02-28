/* eslint-disable indent */
const { AuthType, createClient } = require("webdav");
const ical = require('node-ical');
const transformer = require("./transformer");

function initWebDav(config) {
    return client = createClient(config.listUrl, config.webDavAuth);
}

function parseList(icsStrings) {
    let elements = [];
    for (const icsStr of icsStrings) {
        const icsObj = ical.sync.parseICS(icsStr);
        Object.values(icsObj).forEach(element => {
            if (element.type === 'VTODO') elements.push(element);
        });
    }
    return elements;
}

async function fetchList(config) {
    const client = initWebDav(config);
    const directoryItems = await client.getDirectoryContents("/");

    let icsStrings = [];
    for (const element of directoryItems) {
        const icsStr = await client.getFileContents(element.filename, { format: "text" });
        //console.log(icsStr);
        icsStrings.push(icsStr);
    }
    return icsStrings;
}

module.exports = {
    parseList: parseList,
    fetchList: fetchList
};
