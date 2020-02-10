// original data
const transactions = [
    { source: 0, targets: [1, 2], amounts: [1.5, 0.5] },
    { source: 1, targets: [3, 4], amounts: [1.2, 0.3] },
    { source: 3, targets: [5, 6], amounts: [0.8, 0.2] }
]

let makeTree = (transactions, parent) => {
   let node = {}
   node.name = parent
   node.children = []
   node.amounts = []
   transactions.filter(trsc => {return trsc.source === parent})
               .forEach(trsc => {
                    trsc.amounts.forEach(amt => {
                        node.amounts.push(amt)
                    })
                    trsc.targets.forEach(targ => {
                       node.children.push(makeTree(transactions, targ))
                    })
                })
   return node
}
//console.log(JSON.stringify(makeTree(transactions, 0), null, 2))
const treeData = makeTree(transactions, 0)
export { transactions, makeTree, treeData }

