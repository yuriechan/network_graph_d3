import { makeTree, treeData } from './tree'
import { cluster, transactions } from './data'
import { canvas, gNode, gLink, glinkLabel, arrowheads } from './svg'
import { clusterGraphData } from './cluster'
import * as d3 from 'd3'

 // set margin for layouts
 const margin = { top: 20, right: 40, bottom: 20, left: 40}
 let width = 1000 - margin.right - margin.left
 let height = 1000 - margin.top - margin.bottom
 const expandHeight = 150;
 const expandWidth = expandHeight / 10;

 // set children to null, to only display the root node
   // root, and its fixed coodinate
   const root = d3.hierarchy(clusterGraphData.nodes[0])
   root.x0 = width / 2
   root.y0 = 0
   let tree_d3 = d3.tree().size([width, height])
   
// children
   root.descendants().forEach((d, i) => {
      d._id = i
      d._children = d.children
      if (d.depth !== 4) d.children = null
   })
 
 // canvas
   canvas.attr("height", height)
   .attr("width", width)
   .attr("viewBox", [-margin.right , -margin.top, width + margin.right, height + margin.top])
                    
function update(source) {
   // durations for animation
   const duration = d3.event ? 250 : 0;
   const nodes = root.descendants().reverse()
   const links = root.links()

   // calculate max height of current graph
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
   let newWidth = d3.max(levelWidth) * expandWidth

   // Compute the new tree layout
   tree_d3 = d3.tree().size([width + newWidth, (levelWidth.length - 1) * expandHeight])
   tree_d3(root)

   // Resize the viewBox
   let svg = d3.select("svg")
            .attr("height", 100 + (levelWidth.length - 1) * expandHeight)
            .attr("width", width + newWidth)
            .attr("viewBox", [-margin.right , -margin.top, width + newWidth + margin.right, 100 + margin.top + (levelWidth.length - 1) * expandHeight])
               

   //transitions
   const transitions = canvas.transition()
                        .duration(duration)

   // update, enter, exit for nodes
   const node = gNode.selectAll("g")
               .data(nodes, d => d._id)

   const nodeEnter = node.enter().append("g")
                     .attr("transform", d => `translate(${source.x}, ${source.y})`)
                     .on("click", d => {
                        if (d.children) {
                           d.children.forEach(d => (d.children) ? d.children = null : null)
                           d.children = null
                        } else {
                           d.children = d._children
                        }
                        update(d)
                     })

   nodeEnter.append("circle")
            .attr("r", 10)
            .attr("fill", d => d._children ? "#04ab5b" : "#ADAD")
   
   nodeEnter.append("text")
            .text( d => d.data.name )
               .clone(true).lower()
               .attr("stroke-width", 3)

   const nodeUpdate = node.merge(nodeEnter).transition(transitions)
                  .attr("transform", d => `translate(${d.x}, ${d.y})`)
                  .attr("fill-opacity", 1)
                  .attr("fill-opacity", 1)

   const nodeExit = node.exit().transition(transitions).remove()
                  .attr("transform", d => `translate(${source.x}, ${source.y})`)
                  .attr("fill-opacity", 0)
                  .attr("fill-opacity", 0)
   
    // update, enter, exit for links
   let line = d3.line()
               .x( d => d.x )
               .y( d => d.y )
                
   const link = gLink.selectAll("path")
               .data(links, d => d.target.id)
               .attr("d", d => line([d.source, d.target]))
   
   const linkEnter = link.enter().append("path")
                        .attr("d", d => line([d.source, d.target]))
                        .attr("id", (d, i) => `linkPath${i}`)
                        .attr("marker-end", 'url(#arrowHead)')

   link.merge(linkEnter).transition(transitions)
                        .attr("d", d => line([d.source, d.target]))

   link.exit().transition(transitions).remove()
               .attr("d", d => line([d.source, d.target]))

   const linkLabel = glinkLabel.selectAll("textPath")
                     .data(links, d => d.target.id)

   const linkLabelEnter = linkLabel.enter().append("textPath")
                           .attr("x", d => d.source.x + (d.target.x - d.source.x) * 0.8)
                           .attr("y", d => d.source.y + (d.target.y - d.source.y) * 0.8)
                           .text( d => d.source.data.amounts[1].amount)
                           .attr("xlink:href", (d, i) => `#linkPath${i}`)
                           .attr("fill", "#BAEA")
                           .attr("dy", "5")
                           .attr("startOffset", "50%")
}

update(root);






      

                        

