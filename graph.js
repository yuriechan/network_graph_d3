const data = {
    nodes : [{id: 1, name: "A"}, {id: 2, name: "B"}],
    links: [{source: 1, target: 2, amount: 300}]
}

// canvas
let svg = d3.select("body").append("svg")
    .attr("width", "1000px")
    .attr("height", "1000px")
.append("g")
    .attr("transform", "translate(30,40)")

// initialize the links
let link = svg.selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "line")
    // .attr("x1", 0)
    // .attr("y1", 0)
    // .attr("x2", 50)
    // .attr("y2", 0)
    .attr("x1", function (l) {
        let sourceNode = data.nodes.filter(function (n) {
            return n.id === l.source
        })
        // returns "line"
        console.log(sourceNode)
        // returns undefined 
        console.log(this.attr("cy"))
        // returns undefined 
        console.log(d3.select(this).attr("y1", sourceNode.attr("cy")))
    })
    .attr("stroke-width", 2)
    .style("stroke", "#aaa")


// initialize the nodes
let nodes = svg.selectAll("node")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("cx", function (d, i) { return i * 60})
    .attr("cy", 60)
    .attr("r", 15)
    .style("fill", "#69b3a2")


