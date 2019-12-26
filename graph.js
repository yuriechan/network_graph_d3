const data = {
    nodes : [{id: 1, name: "A"}, {id: 2, name: "B"}, {id: 3, name: "C"}, {id: 4, name: "D"}],
    links: [{source: 1, target: 2, amount: 100}, {source: 2, target: 3, amount: 200}, {source: 3, target: 4, amount: 300}]
}

const margin = { top: 10, right: 30, bottom: 30, left: 40},
width = 400 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom

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
                .style("stroke", "#aaa")

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

// initialize the nodes
let node = svg.selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
                .attr("r", 15)
                .style("fill", "#69b3a2")

let simulation = d3.forceSimulation(data.nodes)
                .force("link", d3.forceLink().id(function(d) {return d.id;}).links(data.links))
                .force("charge", d3.forceManyBody().strength(-400))
                .force("center", d3.forceCenter(width / 2, height / 2))

simulation
    .nodes(data.nodes)
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
    .attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) {return d.y; })

    linkPath
    .attr('d', function(d) {
        return 'M' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
    })
}