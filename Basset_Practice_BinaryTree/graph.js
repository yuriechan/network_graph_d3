const data = {
    "name":0,
    "children":[
       {
          "name":1,
          "children":[
             {
                "name":3,
                "children":[
                   {
                      "name":5,
                      "children":[
 
                      ],
                      "amounts":[
 
                      ]
                   },
                   {
                      "name":6,
                      "children":[
 
                      ],
                      "amounts":[
 
                      ]
                   }
                ],
                "amounts":[
                   {
                      "amount":0.8
                   },
                   {
                      "amount":0.2
                   }
                ]
             },
             {
                "name":4,
                "children":[
 
                ],
                "amounts":[
 
                ]
             }
          ],
          "amounts":[
             {
                "amount":1.2
             },
             {
                "amount":0.3
             }
          ]
       },
       {
          "name":2,
          "children":[
 
          ],
          "amounts":[
 
          ]
       }
    ],
    "amounts":[
       {
          "amount":1.5
       },
       {
          "amount":0.5
       }
    ]
 }

 // set margin for layouts
 const margin = { top: 30, right: 30, bottom: 30, left: 40},
 width = 500 - margin.left - margin.right,
 height = 500 - margin.top - margin.bottom


 // set children to null, to only display the root node
   // root 
   const root = d3.hierarchy(data)
   root.x0 = 0
   root.y0 = 0
 

// children
   root.descendants().forEach((d, i) => {
      d.id = i
      d._children = d.children
      if (d.depth !== 4) d.children = null
   })
 
 // canvas
 let canvas = d3.select("body")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

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
                        .append("textPath")
                              .attr("fill", "#BAEA")
                              .attr("dy", "5")
                              .attr("startOffset", "50%")

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

                    
function update(source) {
   // durations for animation
   const duration = d3.event ? 250 : 0;
   const nodes = root.descendants().reverse()
   const links = root.links()

   // Compute the new tree layout
   let tree_d3 = d3.tree().size([height, width])
   tree_d3(root)

   //transitions
   const transitions = canvas.transition()
                     .duration(duration)

   // update, enter, exit for nodes
   const node = gNode.selectAll("g")
               .data(nodes, d => d.id)

   const nodeEnter = node.enter().append("g")
                     .attr("transform", d => `translate(${source.x}, ${source.y})`)
                     .attr("fill-opacity", 0.5) // later change it to 0
                     .attr("stroke-opacity", 0.5) // later change it to 0
                     .on("click", d => {
                        d.children = d.children ? null : d._children
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
                
   const link = gLink.selectAll("g")
               .data(links, d => d.target.id)
               .attr("id", (d, i) => `linkPath${i}`)
               .attr("d", d => line([d.source, d.target]))

   const linkLabel = glinkLabel.selectAll("textPath")
                     .data(links)
                     .enter()
                     .attr("xlink:href", (d, i) => `#linkPath${i}`)
                     .attr("x", d => d.source.x + (d.target.x - d.source.x) * 0.8)
                     .attr("y", d => d.source.y + (d.target.y - d.source.y) * 0.8)
                     .text( d => d.source.data.amounts[1].amount)
   
   const linkEnter = link.enter().append("path")
                        .attr("d", d => {
                           return line([d.source, d.target])
                        })
                        .attr("marker-end", 'url(#arrowHead)')

   link.merge(linkEnter).transition(transitions)
                        .attr("d", d => {
                           return line([d.source, d.target])
                        })

   link.exit().transition(transitions).remove()
      .attr("d", d => {
         return line([d.source, d.target])
      })
}

update(root);






      

                        

