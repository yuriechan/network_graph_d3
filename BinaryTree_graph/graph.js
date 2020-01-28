const data = {
    source: {
        x: 20,
        y: 10
    },
    target: {
        x: 280,
        y: 100
    }
}

const margin = { top: 10, right: 30, bottom: 30, left: 40},
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom

// canvas
let canvas = d3.select("body")
                .append("svg")
                    .attr("weight", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)

let link = d3.linkVertical()
                    .x(function(d) {return d.x })
                    .y(function(d) {return d.y })

canvas.append("path")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("d", link(data))