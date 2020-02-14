import { clusterJSON, colors } from './data.js'

// data copy pasted from web-app
let cluster = clusterJSON

// data structure  to be used in graphing
let clusterGraphData = {}
console.log(setClusterObject(cluster))

// helper 
function setClusterObject (cluster) {    
    //Set Graph Visualization Data
    clusterGraphData.nodes = []
    clusterGraphData.links = []
    clusterGraphData.nodes.push({ id: cluster.clusterId, name: cluster.realWorldIdentity, identity: cluster.realWorldIdentity, _color: colors[cluster.category], _cssClass: 'border-black' })

    //Node Customization Logic
    for (const neighbor of cluster.neighbors) {
      let node = {}
      if (insertDecimal(neighbor.sentAmount) > 30000)
        node = { id: neighbor.clusterId, name: neighbor.label, category: neighbor.category, _color: colors[neighbor.category], _defColor: '#C0C6DD', _cssClass: 'heavy-neighbour' }
      else
        node = { id: neighbor.clusterId, name: neighbor.label, category: neighbor.category, _color: colors[neighbor.category], _defColor: '#C0C6DD', _cssClass: '' }
      let link = { sid: cluster.clusterId, tid: neighbor.clusterId, name: insertDecimal(neighbor.receivedAmount + neighbor.sentAmount), _color: 'black' }
      node.identity = node.name
      clusterGraphData.nodes.push(node)
      clusterGraphData.links.push(link)
    }
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


