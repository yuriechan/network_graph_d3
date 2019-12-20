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
    .attr("id", function (d, i) {return i})
    .attr("stroke-width", 2)
    .style("stroke", "#aaa")

let linkPaths = svg.selectAll(".linkPath")
// console logs, 'link object'
.data(data.links, function (d) {console.log(d)})
.enter()
.append('path')
.attr('d', function(d){let path = 'M ' + d.source + ' ' + d.source + 'L ' + d.target + ' ' + d.target;
return path})
.attr('class', 'linkPath')
.attr('fill-opacity', 0)
.attr('stroke-opacity', 0)
.attr('fill', 'blue')
.attr('stroke', 'red')
.attr('id', function (d, i) {return 'linkPath' + i})
.style("pointer-events", "none")

let linkLabels = svg.selectAll(".linkLabel")
.data(data.links)
.enter()
.append('text')
.style("pointer-events", "none")
.attr({'class': 'linkLabel', 
        'id': function (d, i) {return 'linkLabel' + i},
        'dx': 80,
        'dy': 0,
        'font-size': 10,
        'fill': '#aaa'});

linkLabels.append('textPath')
    .attr('href', function (d, i) {return '#linkPath' + i})
    .style("pointer-events", "none")
    .data(data.links)
    .text(function (d, i) {return d.amount})

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
    // console logs, 'link object' and the computed property of coordinates
    .attr("x1", function(d) {console.log(d);return d.source.x; })
    .attr("y1", function(d) {return d.source.y; })
    .attr("x2", function(d) {return d.target.x; })
    .attr("y2", function(d) {return d.target.y; })

    node
    .attr("cx", function (d) { return d.x+6; })
    .attr("cy", function (d) {return d.y-6; })

    linkPaths.attr('d', function (d) {let path = 'M ' + d.source.x + ' ' + d.source.y + 'L ' + d.target.x + ' ' + d.target.y;
                                        return path})
}