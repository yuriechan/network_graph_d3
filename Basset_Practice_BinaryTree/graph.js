function treeConverter(arr) {
    let filtered = [];
    for (let i = 0; i < arr.length; i++) {
        let treeData = {
            name: "",
            children: []
        };
        treeData.name = arr[i].source
        for (let j = 0; j < arr[i].targets.length; j++) {
            let obj = {};
            obj["name"] = arr[i].targets[j]
            treeData.children.push(obj)
        }
        filtered.push(treeData)
    }
}

const transactions = [
    { source: 0, targets: [1, 2], amounts: [1.5, 0.5] },
    { source: 1, targets: [3, 4], amounts: [1.2, 0.3] },
    { source: 3, targets: [5, 6], amounts: [0.8, 0.2] }
]

const dataFormat = {
    name: "",
    children: []
}

function recursion (obj) {
    dataFormat.name = obj.source
    for (let i = 0; i < obj.targets.length; i++) {
        let childNode = {}
        childNode["name"] = obj.targets[i]
        dataFormat.children.push(childNode)
    }
    console.log(obj)
    console.log(dataFormat)
    
    dataFormat.children[0].children = []
    for (let k = 0; k < transactions.length; k++) {
        if (transactions[k].source === dataFormat.children[0].name) {
            for (let l = 0; l < transactions[k].targets.length; l++) {
                let obj = {}
                obj["name"] = transactions[k].targets[l]
                dataFormat.children[0].children.push(obj)
                console.log(dataFormat.children[0])
            }
        }
        
    }

    // recursion(dataFormat.children[0])
}

function main (arr) {
    return recursion(arr[0])
}
console.log(main(transactions))