/* eslint-disable indent */
const { AuthType, createClient } = require("webdav");
const ical = require('node-ical');
const transformer = require("./transformer");
const { fetchList, parseList } = require("./webDavHelper");
const config = require("./testConfig");
const icsList = require("./testDataTemplate");

async function test() {
    var todos = [];

    //const icsList = await fetchList(config);
    todos = parseList(icsList);
    todos = transformer.transformData(todos);

    console.log(todos);
    console.log(JSON.stringify(todos));
}

test();