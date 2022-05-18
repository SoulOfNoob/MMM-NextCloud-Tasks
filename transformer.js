/* eslint-disable curly */
/* eslint-disable indent */

function findParent(parents, uid) {
    // Search parents for parent
    for (const parent of parents) {
        // console.log(parent.summary, (parent.uid === uid), (typeof parent.children !== "undefined"));
        if (parent.uid === uid) {
            // if parent is what we are looking for, return it
            return parent;
        } else if (typeof parent.children !== "undefined") {
            // if not, search children recursively
            let childParent = findParent(parent.children, uid);
            // if parent was found in children, return it
            if (childParent) return childParent;
        }
        // else continue
    }
    // if no parent was found, return false
    return false;
}

function transformData(children, parents = []) {
    let orphans = [];

    for (const child of children) {
        if (typeof child["related-to"] === "undefined") {
            // has no relation
            // add to parents
            parents.push(child);
        } else {
            // has relation
            // find parent
            let parent = findParent(parents, (typeof child["related-to"].val === 'undefined' ? child["related-to"] : child["related-to"].val));
            if(parent) {
                // has parent in parents?
                if (typeof parent.children === "undefined") {
                    // parent has no children yet
                    // create children attribute
                    parent.children = [];
                }
                // add child to parent
                parent.children.push(child);
            } else {
                // has no parent in parents?
                // add to orphans
                orphans.push(child);
            }
        }
    }

    // as long as there are orphans recursively call self
    if (orphans.length > 0) {
        //console.log("continue processing orphans:", orphans);
        return transformData(orphans, parents);
    } else {
        //console.log("return parents:", parents);
        return parents;
    }
}

module.exports.transformData = transformData;
