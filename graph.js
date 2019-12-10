// const data = [{origin: "Wallet 1", destination: "Wallet 2", amount: 300}]

// decided to separate the data into nodes and links 
const data = {
    "nodes": [{"id": 1, "name": "A"}, {"id": 2, "name": "B"}],
    "links": [{"source": 1, "target": 2 , "amount": 300}]
}
// canvas
let svg = d3.select(".network-chart")
.append("svg")
    .attr("width", "1000px")
    .attr("height", "1000px")
.append("g")
    .attr("transform", "translate(30,40)")

// initialize the links
let link = svg
.selectAll("line")
.data(data.links)
.enter()
.append("line")
.attr("x1", 0)
.attr("y1", 0)
.attr("x2", 50)
.attr("y2", 0)
.attr("stroke-width", 2)
.style("stroke", "#aaa")


// initialize the nodes
let node = svg
.selectAll("circle")
.data(data.nodes)
.enter()
.append("circle")
.attr("r", 20)
.attr("cx", function (d, i) { return i * 60 })
.style("fill", "#69b3a2")


// returns undefined
console.log(d3.select(data.nodes[0]))

let simulation = d3.forceSimulation(data.nodes)
.force("link", d3.forceLink()
.id(function(d){return d.id})
.links(data.links)
)



