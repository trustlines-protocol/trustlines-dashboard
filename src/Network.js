import React, { useEffect, useRef, useState } from "react"
import vis from "vis-network"

import { fetch_endpoint } from "./api.js"

import "./Network.css"

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
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [network, setNetwork] = useState(null)

  useEffect(function initVisNetwork() {
    setNetwork(new vis.Network(container.current, {}, options))
  }, [])

  useEffect(
    function setListener() {
      if (!network) return

      network.off("selectEdge")
      network.off("selectNode")
      network.off("deselectEdge")
      network.off("deselectNode")
      network.off("stabilizationProgress")
      network.off("stabilizationIterationsDone")
      network.on("selectEdge", params => {
        if (params.edges.length !== 1 || params.nodes.length !== 0) {
          return
        }
        const tl_data = network.body.data.edges.get(params.edges[0])
        const trustline = {
          network: address,
          from: tl_data["from"],
          to: tl_data["to"],
        }
        onSelectTrustline(trustline)
      })
      network.on("selectNode", params => {
        if (params.nodes.length !== 1) {
          return
        }
        onSelectAccount(params.nodes[0])
      })
      network.on("deselectEdge", params => {
        onSelectTrustline(null)
      })
      network.on("deselectNode", params => {
        onSelectAccount(null)
      })
      network.on("stabilizationProgress", params => {
        setLoadingPercent(Math.floor((params.iterations / params.total) * 100))
      })
      network.on("stabilizationProgress", params => {
        setLoadingPercent(Math.floor((params.iterations / params.total) * 100))
      })
      network.on("stabilizationIterationsDone", params => {
        setLoadingPercent(100)
      })
    },
    [address, network, onSelectAccount, onSelectTrustline]
  )

  useEffect(
    function fetchData() {
      async function _fetch() {
        if (!network) return
        network.setData({})
        setLoadingPercent(0)

        const events = await fetch_endpoint(
          process.env.REACT_APP_RELAY_URL + `/api/v1/networks/${address}/events`
        )
        const [nodes, edges] = build_graph(events)
        const data = {
          nodes: new vis.DataSet(nodes),
          edges: new vis.DataSet(edges),
        }
        network.setData(data)
      }

      _fetch()
    },
    [network, address]
  )

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {loadingPercent !== 100 && (
        <progress
          className="progress my-progress is-info"
          value={loadingPercent}
          max="100"
        >
          {loadingPercent}%
        </progress>
      )}
      <div style={{ width: "100%", height: "100%" }} ref={container} />
    </div>
  )
}

export default Network
