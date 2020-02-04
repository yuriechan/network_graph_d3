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
 
 // canvas
 let canvas = d3.select("body")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

let tree_d3 = d3.tree().size([height, width])
const root = d3.hierarchy(data)
tree_d3(root)

const nodes = root.descendants()
const links = root.links()

const node = canvas.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
        .attr("class", "node")
        .attr("transform", d =>  "translate(" + d.x + "," + d.y + ")" )
        .attr("cursor", "pointer")
        .attr("pointer-events", "all")

    node.append("circle")
        .attr("r", 10)
        .attr("fill", "#ADAD")

    node.append("text")
        .text( d => d.data.name )

let line = d3.line()
                .x( d => d.x )
                .y( d => d.y )

const link = canvas.selectAll(".link")
    .data(links)
    .enter()
    .append("g")
        .attr("class", "link")
    .append("path")
        .attr("id", (d, i) => `linkPath${i}`)
        .attr("fill", "none")
        .attr("stroke", "#ADADAD")
        .attr("d", d => line([d.source, d.target]))
        .attr("marker-end", 'url(#arrowHead)')

const linkLabel = canvas.selectAll(".linkLabels")
        .data(links)
        .enter()
        .append("g")
            .attr("id", "linkLabels")
            .attr("class", "linkLabels")
        .append("text")
            .attr("class", "linkLabel")
        .append("textPath")
            .attr("xlink:href", (d, i) => `#linkPath${i}`)
            .attr("fill", "#BAEA")
            .attr("dy", "5")
            .attr("x", d => d.source.x + (d.target.x - d.source.x) * 0.8)
            .attr("y", d => d.source.y + (d.target.y - d.source.y) * 0.8)
            .text( (d) => d.source.data.amounts[1].amount)
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


// set children to null, to only display the root node
 // root 
   root.x0 = root.x
   root.y0 = root.y
  
 // children
   root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth !== 4) d.children = null;
   })


  
