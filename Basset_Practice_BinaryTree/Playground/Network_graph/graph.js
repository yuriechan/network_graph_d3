const data = {
    nodes : [{id: 0, name: "A"}, {id: 1, name: "B"}, {id: 2, name: "C"}, {id: 3, name: "D"}],
    links: [{source: 0, target: 1, amount: 100}, {source: 1, target: 2, amount: 200}, {source: 2, target: 3, amount: 300}, {source: 1, target: 0, amount: 480}, {source: 0, target: 2, amount: 480}]
}

const margin = { top: 10, right: 30, bottom: 30, left: 40},
width = 400 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom

let colorScale = d3.scaleOrdinal(d3.schemeCategory10)

// canvas
let svg = d3.select("body")
            .append("svg")
                .attr("width",  width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

// initialize the links
let link = svg.selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
                .attr("id", function (d, i) {return `link ${i}`})
                .attr("stroke-width", 2)
                .attr('marker-end', 'url(#arrowHead)')
                .style("stroke", function (d){return colorScale(d.source)})

let linkPath = svg.selectAll(".linkPath")
    .data(data.links)
    .enter()
    .append('path')
        .attr('class', 'linkPath')
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .attr('id', function (d, i) {return 'linkPath' + i})
        .style("pointer-events", "none")

let linkLabels = svg.selectAll(".linkLabel")
    .data(data.links)
    .enter()
    .append("text")
        .style("pointer-events", "none")
        .attr('class', 'edgelabel')
        .attr('id', function (d, i) {return 'linkLabel' + i})
        .attr('font-size', 10)
        .attr('fill', '#aaa')

linkLabels.append('textPath')
        .attr('xlink:href', function (d, i){return '#linkPath' + i})
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("startOffset", "50%")
        .text(function (d, i) {return d.amount})

let arrowHeads = d3.select("svg")
                .append('defs')
                .append('marker')
                    .attr('id', 'arrowHead')
                    .attr('viewBox', '-0 -5 10 10')
                    .attr('refX', 23)
                    .attr('refY', 0)
                    .attr('orient', 'auto')
                    .attr('markerWidth', 5)
                    .attr('markerHeight', 5)
                    .attr('xoverflow', 'visible')
                .append('svg:path')
                    .attr('d', 'M 0,-5 L 10,0 L 0,5')
                    .attr('fill', '#999')
                    .style('stroke', 'none')

// initialize the nodes
let node = svg.selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
                .attr("r", 15)
                .style("fill", "#69b3a2")
                .attr("id", function(d, i){return i})

let linkNodes = [];
data.links.forEach(function (link){
    linkNodes.push({
        source: data.nodes[link.source],
        target: data.nodes[link.target]
    })
})

let invisible_linkNode = svg.selectAll(".link-node")
                        .data(linkNodes)
                        .enter()
                        .append("circle")
                            .attr("class", "link-node")
                            .attr("r", 5)
                            .style("fill", "#ccc")

           
let simulation = d3.forceSimulation(data.nodes.concat(linkNodes))
                .force("link", d3.forceLink(data.links).id(function(d) {return d.id;}).distance(function (d){return (d.amount / 100) * 40}))
                .force("charge", d3.forceManyBody().strength(-100))
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("collide", d3.forceCollide(-10))
              
simulation
    .nodes(data.nodes.concat(linkNodes))
    .on("tick", ticked)

simulation
    .force("link")
    .links(data.links)

function ticked() {
    link
    .attr("x1", function(d) {return d.source.x; })
    .attr("y1", function(d) {return d.source.y; })
    .attr("x2", function(d) {return d.target.x; })
    .attr("y2", function(d) {return d.target.y; })

    node
    .attr("cx", function (d) {return d.x < 15 ? d.x = 15 : d.x > 380 ? d.x = 380 : d.x; })
    .attr("cy", function (d) {return d.y < 15 ? d.y = 15 : d.y > 380 ? d.y = 380 : d.y; })

    linkPath
    .attr('d', function(d) {
        return 'M' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
    })

    invisible_linkNode
    .attr("cx", function (d){return d.x = (d.source.x + d.target.x) * 0.5})
    .attr("cy", function (d){return d.y = (d.source.y + d.target.y) * 0.5})
}