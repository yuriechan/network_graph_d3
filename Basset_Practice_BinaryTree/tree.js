// original data
const transactions = [
    { source: 0, targets: [1, 2], amounts: [1.5, 0.5] },
    { source: 1, targets: [3, 4], amounts: [1.2, 0.3] },
    { source: 3, targets: [5, 6], amounts: [0.8, 0.2] }
]

// final data, ready for d3 tree()
let tree = {
    name: "",
    children: []
}

let root = createRoot(transactions[0])
createLeftChild(root.children[0])

function createRoot (obj) {
    tree.name = obj.source
    for (let i = 0; i < obj.targets.length; i++) {
        let child = {}
        child["name"] = obj.targets[i]
        tree.children.push(child)
    }
    return tree
}

function createLeftChild (childObj) {
    childObj.children = []
    for (let k = 0; k < transactions.length; k++) {
        if (transactions[k].source === childObj.name) {
            for (let l = 0; l < transactions[k].targets.length; l++) {
                let child = {}
                child["name"] = transactions[k].targets[l]
                childObj.children.push(child)
            }
        }
    }

    if (childObj.children[0] === undefined) {
        return
    }

    createLeftChild(childObj.children[0])
    console.log(JSON.stringify(root))
}



