import * as d3 from 'd3'


let canvas = d3.select("body")
                .append("svg")
                .attr("id", "canvas")

const gNode = canvas.append("g")
               .attr("class", "node")
               .attr("cursor", "pointer")
               .attr("pointer-events", "all")

const gLink = canvas.append("g")
               .attr("class", "link")
               .attr("fill", "none")
               .attr("stroke", "#ADADAD")
               .attr("stroke-width", 1.5)

const glinkLabel = canvas.append("g")
                              .attr("id", "linkLabels")
                              .attr("class", "linkLabels")
                        .append("text")
                              .attr("class", "linkLabel")                             

const arrowheads = d3.select("svg")
                .append('defs')
                .append('marker')
                    .attr('id', 'arrowHead')
                    .attr('viewBox', '-0 -5 10 10')
                    .attr('refX', 23)
                    .attr('refY', 0)
                    .attr('orient', 'auto')
                    .attr('markerWidth', 8)
                    .attr('markerHeight', 8)
                    .attr('xoverflow', 'visible')
                .append('avg:path')
                    .attr('d', 'M 0, -5 L 10,0 L 0,5')
                    .attr('fill', '#ADADAD')
                    .style('stroke', 'none')

export { canvas, gNode, gLink, glinkLabel, arrowheads }