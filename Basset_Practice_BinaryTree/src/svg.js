import * as d3 from 'd3'

const margin = { top: 20, right: 120, bottom: 20, left: 120}
let width = 1280 - margin.right - margin.left
let height = 800 - margin.top - margin.bottom

let canvas = d3.select("#body")
                .append("svg")
                    .attr("class", "svgCanvas")
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)

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