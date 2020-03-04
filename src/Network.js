import React, { useEffect, useRef, useState } from "react"
import vis from "vis-network"

import { fetch_endpoint } from "./api.js"

import "./Network.css"
import NetworkInfo from "./NetworkInfo"

function filterEvents(eventList, eventName2list) {
  const result = {}
  for (const eventListName of Object.values(eventName2list)) {
    result[eventListName] = []
  }
  for (const e of eventList) {
    if (eventName2list[e.type]) {
      result[eventName2list[e.type]].push(e)
    }
  }
  return result
}

function build_graph(trustlineUpdateEvents) {
  const nodes = new Set()
  const edges = {}

  for (const e of trustlineUpdateEvents) {
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

function Network({ network, onSelectTrustline, onSelectAccount }) {
  const container = useRef(null)
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [visNetwork, setVisNetwork] = useState(null)

  const [numTransfers, setNumTransfers] = useState(null)
  const [numUsers, setNumUsers] = useState(null)

  useEffect(function initVisNetwork() {
    setVisNetwork(new vis.Network(container.current, {}, options))
  }, [])

  useEffect(
    function setListener() {
      if (!visNetwork) return

      visNetwork.off("selectEdge")
      visNetwork.off("selectNode")
      visNetwork.off("deselectEdge")
      visNetwork.off("deselectNode")
      visNetwork.off("stabilizationProgress")
      visNetwork.off("stabilizationIterationsDone")
      visNetwork.on("selectEdge", params => {
        if (params.edges.length !== 1 || params.nodes.length !== 0) {
          return
        }
        const tl_data = visNetwork.body.data.edges.get(params.edges[0])
        const trustline = {
          network: network.address,
          from: tl_data["from"],
          to: tl_data["to"],
        }
        onSelectTrustline(trustline)
      })
      visNetwork.on("selectNode", params => {
        if (params.nodes.length !== 1) {
          return
        }
        onSelectAccount(params.nodes[0])
      })
      visNetwork.on("deselectEdge", params => {
        onSelectTrustline(null)
      })
      visNetwork.on("deselectNode", params => {
        onSelectAccount(null)
      })
      visNetwork.on("stabilizationProgress", params => {
        setLoadingPercent(Math.floor((params.iterations / params.total) * 100))
      })
      visNetwork.on("stabilizationProgress", params => {
        setLoadingPercent(Math.floor((params.iterations / params.total) * 100))
      })
      visNetwork.on("stabilizationIterationsDone", params => {
        setLoadingPercent(100)
      })
    },
    [network, visNetwork, onSelectAccount, onSelectTrustline]
  )

  useEffect(
    function fetchData() {
      async function _fetch() {
        if (!visNetwork) return
        visNetwork.setData({})
        setLoadingPercent(0)

        const events = await fetch_endpoint(
          process.env.REACT_APP_RELAY_URL +
            `/api/v1/networks/${network.address}/events`
        )
        const eventMap = filterEvents(events, {
          TrustlineUpdate: "trustlineUpdateEvents",
          Transfer: "transferEvents",
        })
        const [nodes, edges] = build_graph(eventMap.trustlineUpdateEvents)
        const data = {
          nodes: new vis.DataSet(nodes),
          edges: new vis.DataSet(edges),
        }
        visNetwork.setData(data)
        setNumTransfers(eventMap.transferEvents.length)
        setNumUsers(nodes.length)
      }

      _fetch()
    },
    [visNetwork, network]
  )

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <NetworkInfo
        networkStatic={network}
        numUsers={numUsers}
        numTransfers={numTransfers}
      />
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
