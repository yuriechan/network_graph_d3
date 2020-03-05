<template>
    <svg class="svgCanvas" v-bind:style="styleObject.svgCanvas"
         v-bind:width="canvasSize.width + this.margin.right + this.margin.left"
         v-bind:height="canvasSize.height + this.margin.top + this.margin.bottom">
        <g v-bind:style="{ 'transform' : `translate(${margin.left}px, ${margin.top}px)`}">
            <path v-for="(link, i) in links"
                  v-bind:key="link.id"
                  v-bind:id="`linkPath${i}`"
                  v-bind:d="line([link.source, link.target])"
                  class="link" 
                  fill="none" 
                  stroke="#ADADAD" 
                  stroke-width="1.5" 
                  marker-end="url(#arrowHead)">
            </path>
            <g class="linkLabels" id="LinkLabels">
                <text class="linkLabel">
                    <textPath v-for="(link, i) in links"
                        v-bind:key="link.id"
                        v-bind:x="link.source.x + (link.target.x - link.source.x) * 0.8" 
                        v-bind:y="link.source.y + (link.target.y - link.source.y) * 0.8" 
                        v-bind = "{ 'xlink:href' : '#linkPath'+i }" 
                        class="link-label" 
                        dy="5" 
                        startOffset="40%">
                        {{ link.target.data.transactionAmount }}
                    </textPath>
                </text>
            </g>
            <g v-for="node in nodes" v-bind:key="node.id" 
               v-bind:style="gNodeCssStyling(node)" 
               class="node"
               v-on:click="nodeEnter(node)">
                <circle v-bind:style="circleCssStyling(node)"
                        v-bind:class="setClassName(node)"
                        v-on:mouseover="labelAppear($event)"
                        v-on:mouseout="labelDisappear($event)">
                </circle>
                <text class="node-label"
                      v-bind:style="textNodeCssStyling()">
                    {{ node.data.name }}
                </text>
            </g>
        </g>
        <defs>
            <marker id="arrowHead" viewBox="-0 -5 10 10" refX="19" refY="0" orient="auto" markerWidth="8" markerHeight="8" xoverflow="visible">
                <path d="M 0, -5 L 10,0 L 0,5" fill="#ADADAD" style="stroke: none;"></path>
            </marker>
        </defs>
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
            clusterGraphData: {},
            margin: {
                top: 40,
                right: 120,
                bottom: 40,
                left: 120
            },
            canvasSize: {
                width: 1280,
                height: 800,
                newWidth: Number,
                newHeight: Number
            },
            indexID: 0,
            root: null,
            tree_d3: null,
            styleObject: {
                svgCanvas: {},
                g: {},
                gNode: {},
                circleNode: {},
                textNode: {}
            },
            duration: null,
            transitions: null,
            levelWidth: [1],
            nodes: null,
            links: null,
            node: null,
            link: null,
            classObject: {
                gNode: {}
            },
            line: d3.line().x( d => d.x ).y( d => d.y ),
            level: 0
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
        },
        setCanvasSize(width, height) {
            //this.canvasSize.width = width - this.margin.right - this.margin.left
            //this.canvasSize.height = height - this.margin.top - this.margin.bottom
        },
        setCssStyling() {
           // this.styleObject.svgCanvas.width = this.canvasSize.width + this.margin.right + this.margin.left
            //this.styleObject.svgCanvas.height = this.canvasSize.height + this.margin.top + this.margin.bottom
            //this.styleObject.g.transform = `translate(${this.margin.left}px, ${this.margin.top}px)`
        },
        toggleAll(d) {
            if (d.children) {
                d.children.forEach(this.toggleAll)
                this.toggle(d)
            }
        },
        toggle(d) {
            if (d.children) {
                d._children = d.children
                d.children = null
            } else {
                d.children = d._children
                d._children = null
            }
        },
        childCount(n, level, levelWidth = [1]) {
            let vm = this
            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0)
                levelWidth[level + 1] += n.children.length
                n.children.forEach(function(d) {
                    vm.childCount(d, level + 1, levelWidth)
                })
            }
            return levelWidth
        },
        setClassName(d) {
            let classObject = {}
            classObject[d.data._cssClass ? d.data._cssClass : null]
            classObject[d.data._cssClass] = (Object.keys(this.classObject)) ? true : null
            return classObject
        },
        circleCssStyling(d) {
            let styleObject = {}
            styleObject.r = 10
            styleObject.fill = d.data._color ? d.data._color : d.data._defColor
            return styleObject
        },
        gNodeCssStyling(d) {
            let styleObject = {}
            styleObject.cursor = d._children ? 'pointer' : null
            styleObject['pointer-events'] = 'all'
            styleObject.transform = (d.id === 1) ? `translate(${d.x0}px, ${d.y0}px)` : `translate(${d.x}px, ${d.y}px)`
            return styleObject
        },
        textNodeCssStyling() {
            this.styleObject.textNode['fill-opacity'] = 0
            this.styleObject.textNode['text-anchor'] = 'start'
            this.styleObject.textNode.transform = 'translate(-30px, -15px)'
            return this.styleObject.textNode
        },
        labelAppear(e) {
            d3.select(e.target.nextSibling).transition().duration(250).style("fill-opacity", 1)
        },
        labelDisappear(e) {
            d3.select(e.target.nextSibling).transition().duration(250).style("fill-opacity", 0)
        },
        nodeEnter(d) {
           this.toggle(d)
           this.tree_d3(this.root)
           this.nodes = this.root.descendants().reverse()
           this.links = this.root.links()
        }
    },
    created() {
        this.setClusterObject(this.testTransactionData)
        this.root = d3.hierarchy(this.clusterGraphData.nodes[0])
        this.root.children.forEach(this.toggleAll)
        this.toggle(this.root)
        this.nodes = this.root.descendants().reverse()
        this.links = this.root.links()           
    },
    watch: {
        nodes(newVal) {
            this.canvasSize.width = d3.max(this.childCount(this.root, 0)) * 20
            this.canvasSize.height = this.childCount(this.root, 0).length * 180
            this.root.x0 = this.canvasSize.width / 2
            this.root.y0 = 0
            this.tree_d3 = d3.tree().size([this.canvasSize.width, this.canvasSize.height])
            this.tree_d3(this.root)  

            newVal.forEach(function (d) {
                d.y = d.depth * 180
            })  
        }
    }
}
</script>

<style scoped>
circle.border-black {
    stroke: black;
    stroke-width: 3px;
}

circle.heavy-neighbour {
    stroke: #10C1FF;
    stroke-width: 3px;
}

text.node-label {
    fill: black;
    font-size: 14px;
    font-weight: bold;
}

textPath.link-label {
    fill: black;
    font-size: 10px;
    font-weight: bold;
}
</style>