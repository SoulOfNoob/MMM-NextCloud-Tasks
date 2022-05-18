function sortPriority(a, b){
    return ((parseInt(a.priority) - (parseInt(b.priority))));
}

function sortPriorityDesc(a, b){
    return ((parseInt(b.priority) - (parseInt(a.priority))));
}

function sortCreated(a, b) {
    return new Date(a.created).getTime() - new Date(b.created).getTime();
}

function sortCreatedDesc(a, b) {
    return new Date(b.created).getTime() - new Date(a.created).getTime();
}

function sortModified(a, b) {
    return new Date(a.lastmodified).getTime() - new Date(b.lastmodified).getTime();
}

function sortModifiedDesc(a, b) {
    return new Date(b.lastmodified).getTime() - new Date(a.lastmodified).getTime();
}

module.exports = {
    sortPriority: sortPriority,
    sortPriorityDesc: sortPriorityDesc,
    sortCreated: sortCreated,
    sortCreatedDesc: sortCreatedDesc,
    sortModified: sortModified,
    sortModifiedDesc: sortModifiedDesc
}
