import React, { useEffect, useRef, useState } from "react"
import { fetch_endpoint } from "./api.js"

import "./Network.css"
import NetworkInfo from "./NetworkInfo"
import DiffTime from "./DiffTime"
import { chart } from "./d3Chart"

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

    edges[[address1, address2]] = {
      id: address1 + address2,
      source: address1,
      target: address2,
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

function Network({ network, onSelectTrustline, onSelectAccount }) {
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [graph, setGraph] = useState({ links: [], nodes: [] })

  const [numTransfers, setNumTransfers] = useState(null)
  const [numUsers, setNumUsers] = useState(null)

  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(null)

  function fetchData() {
    let networkGraph = { links: [], nodes: [] }
    setLoadingPercent(0)
    setNumTransfers(0)
    setNumUsers(0)
    let finishedLoading = true

    function startFetchData() {
      let fromBlock = 0

      async function _fetchMoreData() {
        if (!finishedLoading) {
          console.log("Skip fetching, because old still in progress")
          return
        }
        finishedLoading = false
        console.log("Fetch events from block ", fromBlock)
        let events = await fetch_endpoint(
          process.env.REACT_APP_RELAY_URL +
            `/api/v1/networks/${network.address}/events?fromBlock=${fromBlock}`
        )

        if (events.length === 0) {
          console.log("No new events")
          setLastUpdateTimestamp(Date.now())
          finishedLoading = true
          return
        }
        const eventMap = filterEvents(events, {
          TrustlineUpdate: "trustlineUpdateEvents",
          Transfer: "transferEvents",
        })
        const [nodes, edges] = build_graph(eventMap.trustlineUpdateEvents)

        const newGraph = {
          links: [...networkGraph.links, ...edges],
          nodes: [...networkGraph.nodes, ...nodes],
        }
        networkGraph = newGraph
        finishedLoading = true
        setGraph(newGraph)

        setNumTransfers(
          (numTransfers) => numTransfers + eventMap.transferEvents.length
        )
        setNumUsers(networkGraph.nodes.length)
        setLastUpdateTimestamp(Date.now())
        fromBlock = events[events.length - 1].blockNumber + 1
        setLoadingPercent(100)
      }

      return _fetchMoreData()
    }

    startFetchData()
  }

  useEffect(fetchData, [network])

  useEffect(() => {
    chart(graph, network.address, onSelectTrustline, onSelectAccount)
  }, [graph, network, onSelectTrustline, onSelectAccount])

  return (
    <div>
      {loadingPercent !== 100 ? (
        "Loading..."
      ) : (
        <>
          <NetworkInfo
            networkStatic={network}
            numUsers={numUsers}
            numTransfers={numTransfers}
          />
          last updated: <DiffTime timestamp={lastUpdateTimestamp} />{" "}
          <a onClick={() => fetchData()}>Click here to update.</a>
        </>
      )}
      <div style={{ width: "100%", height: "100%" }} id="svgContainer"></div>
    </div>
  )
}

export default Network
