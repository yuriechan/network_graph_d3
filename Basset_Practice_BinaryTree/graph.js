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
    // for (let k = 0; k < obj.targets.length; k++) {
    //     console.log(`index num of obj targets: ${k}`)
    //     console.log(`obj.targets: ${obj.targets[k]}`)
    //     for (let j = 0; j < transactions.length; j++) {
    //         // console.log(`index number of transactions: ${j}`)
    //         // console.log(transactions[j])
    //         console.log('dataFormat')
    //         console.log(dataFormat.children[k].name)
    //         // console.log(transactions[j])
    //         // if (dataFormat.children[k].name === transactions[j].source) {
    //         //     console.log(dataFormat.children[k].name)
    //         //     console.log(transactions[j])
    //         //     recursion(transactions[j])
    //         // }
    //     }
    // }

    // recursion(dataFormat.children[0])
    console.log(dataFormat)
}

function main (arr) {
    recursion(arr[0])
}
console.log(main(transactions))
// console.log(treeConverter(transactions))