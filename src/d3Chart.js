const d3 = require("d3")

const height = 1024
const width = 1024

let isDragging = false
let selectedNodeId = null
let selectedLinkId = null

const drag = (simulation) => {
  function dragstarted(event, d) {
    isDragging = true
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(event, d) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(event, d) {
    isDragging = false
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
}

export function chart(
  data,
  networkAddress,
  onSelectTrustline,
  onSelectAccount
) {
  if (data.length === 0) {
    return
  }
  const linksData = data.links.map((d) => Object.create(d))
  const nodesData = data.nodes.map((d) => Object.create(d))

  const simulation = d3
    .forceSimulation(nodesData)
    .force(
      "link",
      d3
        .forceLink(linksData)
        .id((d) => d.id)
        .distance(function (d) {
          return 60
        })
    )
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX())
    .force("y", d3.forceY())

  d3.select("svg").remove()

  const svg = d3
    .select("#svgContainer")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(
      d3.zoom().on("zoom", function (event) {
        svg.attr("transform", event.transform)
      })
    )
    .append("g")

  const links = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(linksData)
    .join("line")
    .attr("stroke-width", 2)
  const nodes = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodesData)
    .join("circle")
    .attr("r", 5)
    .attr("fill", "#69b3b2")
    .call(drag(simulation))

  nodes.on("click", (d, i) => {
    selectedNodeId = data.nodes[i.index].id
    nodes.style("fill", (link_d) => {
      return link_d.id === selectedNodeId ? "red" : "#b8b8b8"
    })

    onSelectAccount(selectedNodeId)
  })

  nodes
    .on("mouseover", function (event, d) {
      if (isDragging) {
        return false
      }
      // Highlight the nodes: every node is green except of him
      nodes.style("fill", (nodeId) => {
        if (selectedNodeId === null) {
          return "#B8B8B8"
        }
        return nodeId.id === selectedNodeId ? "red" : "#B8B8B8"
      })
      d3.select(this).style("fill", "#69b3b2")
      // Highlight the connections
      links
        .style("stroke", function (link_d) {
          return link_d.__proto__.source === d.id ||
            link_d.__proto__.target === d.id
            ? "#69b3b2"
            : "#b8b8b8"
        })
        .style("stroke-width", function (link_d) {
          return link_d.__proto__.source === d.id ||
            link_d.__proto__.target === d.id
            ? 2
            : 1
        })
    })
    .on("mouseout", function (event, d) {
      if (isDragging) {
        return false
      }
      nodes.style("fill", (nodeId) => {
        if (selectedNodeId === null) {
          return "#69b3b2"
        }
        return nodeId.id === selectedNodeId ? "red" : "#69b3b2"
      })
      links
        .style("stroke", (link_d) => {
          return selectedLinkId === link_d.id ? "red" : "black"
        })
        .style("stroke-width", "1")
    })

  links.on("click", (d, i) => {
    const tl_data = data.links[i.index]
    selectedLinkId = tl_data.id
    const trustline = {
      network: networkAddress,
      from: tl_data["source"],
      to: tl_data["target"],
    }

    links.style("stroke", (link_d) => {
      return selectedLinkId === link_d.id ? "red" : "black"
    })

    onSelectTrustline(trustline)
  })

  nodes.append("title").text((d) => d.id)

  simulation.on("tick", () => {
    links
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)

    nodes.attr("cx", (d) => d.x).attr("cy", (d) => d.y)
  })

  return svg.node()
}
