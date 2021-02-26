/* eslint-disable indent */
const { AuthType, createClient } = require("webdav");
const ical = require('node-ical');
const transformer = require("./transformer");
const config = require("./testConfig");

var todos = [];

const client = createClient(config.listUrl, config.webDavAuth);

async function getData() {
    try {
        const directoryItems = await client.getDirectoryContents("/");

        for (const element of directoryItems) {
            await readData(element.filename)
        }
        todos = transformer.transformData(todos);
        console.log(todos);
    } catch (error) {
        if(error.status === 401) {
            console.error("Unauthorized");
        }
    }
}

async function readData(filename) {
    const str = await client.getFileContents(filename, { format: "text" });
    const directEvents = ical.sync.parseICS(str);
    Object.values(directEvents).forEach(element => {
        if (element.type === 'VTODO') todos.push(element);
    });
}

getData();