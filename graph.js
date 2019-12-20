const data = {
    nodes : [{id: 1, name: "A"}, {id: 2, name: "B"}],
    links: [{source: 1, target: 2, amount: 300}]
}

let margin = { top: 10, right: 30, bottom: 30, left: 40},
width = 400 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom

// canvas
let svg = d3.select("body").append("svg")
    .attr("width",  width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// initialize the links
let link = svg.selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "line")
    .attr("stroke-width", 2)
    .style("stroke", "#aaa")


// initialize the nodes
let node = svg.selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", 15)
    .style("fill", "#69b3a2")


let simlulation = d3.forceSimulation(data.nodes)
.force("link", d3.forceLink()
    .id(function(d) {return d.id;})
    .links(data.links))
.force("charge", d3.forceManyBody().strength(-400))
.force("center", d3.forceCenter(width / 2, height / 2))
.on("end", ticked)

function ticked() {
    link
    .attr("x1", function(d) {return d.source.x; })
    .attr("y1", function(d) {return d.source.y; })
    .attr("x2", function(d) {return d.target.x; })
    .attr("y2", function(d) {return d.target.y; })

    node
    .attr("cx", function (d) { return d.x+6; })
    .attr("cy", function (d) {return d.y-6; })
}