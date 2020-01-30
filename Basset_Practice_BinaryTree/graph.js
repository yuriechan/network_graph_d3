const transactions = [
    { source: 0, targets: [1, 2], amounts: [1.5, 0.5] },
    { source: 1, targets: [3, 4], amounts: [1.2, 0.3] },
    { source: 3, targets: [5, 6], amounts: [0.8, 0.2] }
]


function treeConverter(arr) {
    let filtered = [];
    for (let i = 0; i < arr.length; i++) {
        // console.log(arr[i])
        let treeData = {
            name: "",
            children: []
        };
        treeData.name = arr[i].source
        for (let j = 0; j < arr[i].targets.length; j++) {
            // console.log(`This is target ${arr[i].targets[j]}`)
            let obj = {};
            obj["name"] = arr[i].targets[j]
            // console.log(arr[i].targets[j])
            treeData.children.push(obj)
        }
        filtered.push(treeData)
    }
    console.log(filtered)
}

console.log(treeConverter(transactions))