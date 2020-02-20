import { clusterJSON, colors } from './data.js'

// data copy pasted from web-app
let cluster = clusterJSON

// data structure  to be used in graphing
let clusterGraphData = {}
setClusterObject(cluster)

// helper 
function setClusterObject (cluster) {    
    //Set Graph Visualization Data
    clusterGraphData.nodes = []
    clusterGraphData.links = []
    clusterGraphData.nodes.push({ id: cluster.clusterId, name: cluster.realWorldIdentity, identity: cluster.realWorldIdentity, _color: colors[cluster.category], _cssClass: 'border-black', children: []})

    //Node Customization Logic
    for (const neighbor of cluster.neighbors) {
      let node = {}
      if (insertDecimal(neighbor.sentAmount) > 30000)
        node = { id: neighbor.clusterId, name: neighbor.label, category: neighbor.category, _color: colors[neighbor.category], _defColor: '#C0C6DD', _cssClass: 'heavy-neighbour' }
      else
        node = { id: neighbor.clusterId, name: neighbor.label, category: neighbor.category, _color: colors[neighbor.category], _defColor: '#C0C6DD', _cssClass: '' }
      
      let link = { sid: cluster.clusterId, tid: neighbor.clusterId, name: insertDecimal(neighbor.receivedAmount + neighbor.sentAmount), _color: 'black' }
      node.transactionAmount = insertDecimal(neighbor.receivedAmount + neighbor.sentAmount)
      node.identity = node.name
      node.children = (neighbor.children) ? neighbor.children : null 

      if (node.children) {
        // remove the first object in the array (bc the first item is itself)
        node.children.splice(0,1)
        // remove the parent item from the children array 
        node.children = node.children.filter(e => parseInt(clusterGraphData.nodes[0].id) !== parseInt(e.id))
      }
      clusterGraphData.nodes[0].children.push(node)
      clusterGraphData.links.push(link)
    }
    //console.log(clusterGraphData)
    return clusterGraphData
}

function insertDecimal (long) {
    let balance = String(long).split('')
    if (String(balance).charAt(0) !== '-') {
      while (balance.length - 8 < 0) balance.splice(0, 0, '0')
      balance.splice(balance.length - 8, 0, '.')
    } else {
      while (balance.length - 9 < 0) balance.splice(1, 0, '0')  
      balance.splice(balance.length - 8, 0, '.')
    }
    balance = balance.join('')
    return parseFloat(balance)
  }


export { clusterGraphData, insertDecimal }