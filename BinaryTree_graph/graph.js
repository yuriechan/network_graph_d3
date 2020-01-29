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
                    .attr("weight", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

//link generator
// let link = d3.linkVertical()
//                     .x(function(d) {return d.x })
//                     .y(function(d) {return d.y })

let tree = d3.tree()
                .size([height,width])
// assign properties for 'hierarchy' 
const root = d3.hierarchy(data);
// assign coordinates for the parent and its descendants
tree(root);

// return array of nodes, with generated coordinates
const nodes = root.descendants();
// return array of links, with generated coordinates
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

console.log(root);
console.log(nodes);
console.log(links);

// canvas.append("path")
//     .attr("fill", "none")
//     .attr("stroke", "black")
//     .attr("d", link(data))