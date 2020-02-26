import { clusterGraphData } from './cluster'
import { toggleAll, toggle } from './helpers'
import * as d3 from 'd3'

 // **
 const margin = { top: 40, right: 120, bottom: 40, left: 120}
 let width = 1280 - margin.right - margin.left
 let height = 800 - margin.top - margin.bottom
 let i = 0

 // **
 const root = d3.hierarchy(clusterGraphData.nodes[0])
 let tree_d3 = d3.tree().size([width, height])
   
// not used yet 
// let verticalLink = d3.linkVertical()
//                      .x(function (d) { return d.x })
//                      .y(function (d) { return d.y }) 

// **
   let vis = d3.select("#body")
               .append("svg")
                  .attr("class", "svgCanvas")
                  .attr("width", width + margin.right + margin.left)
                  .attr("height", height + margin.top + margin.bottom)
               .append("g")
                  .attr("transform", `translate(${margin.left}, ${margin.top})`)

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

   const glinkLabel = vis.append("g")
                              .attr("id", "linkLabels")
                              .attr("class", "linkLabels")
                           .append("text")
                              .attr("class", "linkLabel")   

// **
   root.x0 = width / 2
   root.y0 = 0

// **
   root.children.forEach(toggleAll)
   toggle(root)
   update(root)
                    
function update(source) {
   // **
   const duration = d3.event ? 250 : 0;
 
   // **
   let levelWidth = [1]
   let childCount = function (n, level) {
      if (n.children && n.children.length > 0) {
         if (levelWidth.length <= level + 1) levelWidth.push(0)
         levelWidth[level + 1] += n.children.length
         n.children.forEach(function(d) {
            childCount(d, level + 1)
         })
      }
   }
   childCount(root, 0)
   let newWidth = d3.max(levelWidth) * 20
   let newHeight = levelWidth.length * 180
   console.log(levelWidth)
   // **
   tree_d3 = d3.tree().size([newWidth, newHeight])
   d3.select("svg.svgCanvas")
      .attr("width", newWidth + margin.right + margin.left)
      .attr("height", newHeight + margin.top + margin.bottom)

   // **
   tree_d3(root)
   const nodes = root.descendants().reverse()
   const links = root.links()

   // **
   nodes.forEach(function (d) {
      d.y = d.depth * 180
   })
               
   //transitions
   const transitions = vis.transition().duration(duration)

   // **
   const node = vis.selectAll("g.node")
               .data(nodes, function(d) { return d.id || (d.id = ++i); });

   // **
   const nodeEnter = node.enter().append("svg:g")
                     .attr("class", "node")
                     .attr("cursor", "pointer")
                     .attr("pointer-events", "all")
                     .attr("transform", d => `translate(${source.x0}, ${source.y0})`)
                     .on("click", d => {
                        toggle(d)
                        update(d)
                     })

   // ** (not exactly same)
   nodeEnter.append("circle")
            .attr("r", 10)
            .attr("fill", d => d.data._color ? d.data._color : d.data._defColor)
            .attr("class", d => d.data._cssClass ? d.data._cssClass : null)

    // ** (not exactly same)
   nodeEnter.append("text")
            .text( d => d.data.name )
               .attr("class", "node-label")
               .attr("text-anchor", "start")
               .attr("transform", "translate(-30, -15)")

    // ** (not exactly same)
   const nodeUpdate = node.merge(nodeEnter).transition(transitions)
                  .attr("transform", d => `translate(${d.x}, ${d.y})`)
                  .attr("fill-opacity", 1)
                  .attr("fill-opacity", 1)

   // **
   const nodeExit = node.exit().transition(transitions).remove()
                  .attr("transform", d => `translate(${source.x}, ${source.y})`)
                  .attr("fill-opacity", 0)
                  .attr("fill-opacity", 0)
   
    // update, enter, exit for links
   let line = d3.line()
               .x( d => d.x )
               .y( d => d.y )
                
   const link = vis.selectAll("path.link")
               .data(links, d => d.target.id)
               //.attr("d", d => line([d.source, d.target]))
   
   const linkEnter = link.enter().insert("svg:path", "g")
                        .attr("class", "link")
                        .attr("fill", "none")
                        .attr("stroke", "#ADADAD")
                        .attr("stroke-width", 1.5)
                        .attr("d", 
                           d3.line()
                              .x( d => source.x0 )
                              .y( d => source.y0 )
                        )
                        .attr("id", (d, i) => `linkPath${i}`)
                        .attr("marker-end", 'url(#arrowHead)')
                        .transition(transitions)
                        .attr("d", function(d){
                           return line([d.source, d.target])
                       })

   link.merge(linkEnter).transition(transitions)
                        .attr("d", d => line([d.source, d.target]))

   link.exit().transition(transitions).remove()
               .attr("d", d => line([d.source, d.target]))

   const linkLabel = glinkLabel.selectAll("textPath")
                     .data(links, d => d.target.id)

   const linkLabelEnter = linkLabel.enter().append("textPath")
                           .attr("x", d => d.source.x + (d.target.x - d.source.x) * 0.8)
                           .attr("y", d => d.source.y + (d.target.y - d.source.y) * 0.8)
                           .text( d => d.target.data.transactionAmount)
                           .attr("xlink:href", (d, i) => `#linkPath${i}`)
                           .attr("class", "link-label")
                           .attr("dy", "5")
                           .attr("startOffset", "50%")
       
   // **
   nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
      });
}








      

                        

