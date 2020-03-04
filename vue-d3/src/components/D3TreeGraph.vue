<template>
    <svg>

    </svg>
</template>

<script>
import * as d3 from 'd3'
import { testTransactionData, colors } from '../transactions'

export default {
    name: 'D3TreeGraph',
    data() {
        return {
            testTransactionData: testTransactionData,
            colors: colors,
            clusterGraphData: {}
        }
    },
    methods: {
        setClusterObject(cluster) {
            //Set Graph Visualization Data
            this.clusterGraphData.nodes = []
            this.clusterGraphData.links = []
            this.clusterGraphData.nodes.push({ id: cluster.clusterId, name: cluster.realWorldIdentity, identity: cluster.realWorldIdentity, _color: this.colors[cluster.category], _cssClass: 'border-black', children: []})
            //Node Customization Logic
            for (const neighbor of cluster.neighbors) {
            let node = {}
            if (this.insertDecimal(neighbor.sentAmount) > 30000)
                node = { id: neighbor.clusterId, name: neighbor.label, category: neighbor.category, _color: this.colors[neighbor.category], _defColor: '#C0C6DD', _cssClass: 'heavy-neighbour' }
            else
                node = { id: neighbor.clusterId, name: neighbor.label, category: neighbor.category, _color: this.colors[neighbor.category], _defColor: '#C0C6DD', _cssClass: '' }
            
            let link = { sid: cluster.clusterId, tid: neighbor.clusterId, name: this.insertDecimal(neighbor.receivedAmount + neighbor.sentAmount), _color: 'black' }
            node.transactionAmount = this.insertDecimal(neighbor.receivedAmount + neighbor.sentAmount)
            node.identity = node.name
            node.children = (neighbor.children) ? neighbor.children : null 

            if (node.children) {
                // remove the first object in the array (bc the first item is itself)
                node.children.splice(0,1)
                // remove the parent item from the children array 
                let filteredChildArr = node.children.filter(e => parseInt(this.clusterGraphData.nodes[0].id) !== parseInt(e.id))
                node.children.splice(0, node.children.length, ...filteredChildArr)
            }
            this.clusterGraphData.nodes[0].children.push(node)
            this.clusterGraphData.links.push(link)
            }
            return this.clusterGraphData
        },
        insertDecimal(long) {
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
    },
    beforeMount() {
        this.setClusterObject(this.testTransactionData)
    }
}
</script>

<style scoped>
</style>