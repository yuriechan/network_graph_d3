const data = {
    "name": "max",
    "children": 
    [
     {
        "name": "Sylvia",
        "children": [{ "name": "Craig" }, { "name": "Robin" }, { "name": "Anna" }]
     },   
     { 
         "name": "David",
         "children": [{ "name": "Jeff", "size": 3534 }, { "name": "Buffy", "size": 5731 }]
     }
    ]
}

// set margin for layouts
const margin = { top: 10, right: 30, bottom: 30, left: 40},
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom

// canvas
let canvas = d3.select("body")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")



let tree = d3.tree().size([height,width])
const root = d3.hierarchy(data);
tree(root);
const nodes = root.descendants();
const links = root.links();

const node = canvas.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" })
    
    node.append("circle")
        .attr("r", 5)
        .attr("fill", "blue")

    node.append("text")
        .text(function (d) {return d.data.name })

//link generator
// let vertical = d3.linkVertical()
let line = d3.line()
                .x(function(d) { return d.x })
                .y(function(d) { return d.y })

const link = canvas.selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#ADADAD")
    .attr("d", function(d){
        return line([d.source, d.target])
    })

