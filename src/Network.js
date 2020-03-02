import React, { useEffect, useRef, useState } from "react"
import vis from "vis-network"

import { fetch_endpoint } from "./api.js"

function build_graph(event_list) {
  const nodes = new Set()
  const edges = {}

  for (const e of event_list) {
    if (e.type === "TrustlineUpdate") {
      const addresses = [e.from, e.to]
      for (const address of addresses) {
        nodes.add(address)
      }

      let [address1, address2] = addresses
      if (address2 < address1) {
        ;[address1, address2] = [address2, address1]
      }

      edges[[address1, address2]] = { from: address1, to: address2 }
    }
  }
  const vis_nodes = []
  const vis_edges = []
  for (const node of nodes) {
    vis_nodes.push({ id: node, label: node.slice(0, 7) })
  }
  for (const edge of Object.values(edges)) {
    vis_edges.push(edge)
  }
  return [vis_nodes, vis_edges]
}

const options = {
  autoResize: true,
  height: "100%",
  width: "100%",
  interaction: {
    selectConnectedEdges: false,
  },
}

function Network({ address, onSelectTrustline, onSelectAccount }) {
  const container = useRef(null)
  const [loading, setLoading] = useState(true)
  const [network, setNetwork] = useState(null)

  useEffect(() => {
    async function _fetch() {
      network && network.setData({})
      setLoading(true)
      const events = await fetch_endpoint(
        process.env.REACT_APP_RELAY_URL + `/api/v1/networks/${address}/events`
      )
      const [nodes, edges] = build_graph(events)
      const data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges),
      }
      let new_network
      if (network) {
        network.setData(data)
        new_network = network
      } else {
        new_network = new vis.Network(container.current, data, options)
        setNetwork(new_network)
      }
      new_network.off("selectEdge")
      new_network.off("selectNode")
      new_network.off("deselectEdge")
      new_network.off("deselectNode")
      new_network.on("selectEdge", function(params) {
        if (params.edges.length !== 1 || params.nodes.length !== 0) {
          return
        }
        const tl_data = data.edges.get(params.edges[0])
        const trustline = {
          network: address,
          from: tl_data["from"],
          to: tl_data["to"],
        }
        onSelectTrustline(trustline)
      })
      new_network.on("selectNode", function(params) {
        if (params.nodes.length !== 1) {
          return
        }
        onSelectAccount(params.nodes[0])
      })
      new_network.on("deselectEdge", function(params) {
        onSelectTrustline(null)
      })
      new_network.on("deselectNode", function(params) {
        onSelectAccount(null)
      })
      setLoading(false)
    }

    _fetch()
  }, [network, address, onSelectTrustline, onSelectAccount])

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {loading && <div className={"has-text-centered"}>loading...</div>}
      <div style={{ width: "100%", height: "100%" }} ref={container} />
    </div>
  )
}

export default Network
