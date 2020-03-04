import React, { useEffect, useRef, useState } from "react"
import vis from "vis-network"

import { fetch_endpoint } from "./api.js"

import "./Network.css"
import NetworkInfo from "./NetworkInfo"
import DiffTime from "./DiffTime"

const UPDATE_INTERVAL = 5000

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
      from: address1,
      to: address2,
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

function Network({ network, onSelectTrustline, onSelectAccount }) {
  const container = useRef(null)
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [visNetwork, setVisNetwork] = useState(null)

  const [numTransfers, setNumTransfers] = useState(null)
  const [numUsers, setNumUsers] = useState(null)

  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(null)

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
    },
    [network, visNetwork, onSelectAccount, onSelectTrustline]
  )

  useEffect(
    function fetchData() {
      if (!visNetwork) return
      console.log("Init fetch")
      visNetwork.setData({})
      setLoadingPercent(0)
      setNumTransfers(0)
      setNumUsers(0)
      let nodeSet = null
      let edgeSet = null
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

          if (nodeSet == null) {
            console.log("Init network data")
            nodeSet = new vis.DataSet(nodes)
            edgeSet = new vis.DataSet(edges)
            const data = {
              nodes: nodeSet,
              edges: edgeSet,
            }
            visNetwork.setData(data)
            visNetwork.once("stabilizationIterationsDone", params => {
              finishedLoading = true
              setLoadingPercent(100)
            })
          } else {
            console.log("Update network data")
            nodeSet.update(nodes)
            edgeSet.update(edges)
            finishedLoading = true
          }

          setNumTransfers(
            numTransfers => numTransfers + eventMap.transferEvents.length
          )
          setNumUsers(nodeSet.length)
          setLastUpdateTimestamp(Date.now())
          fromBlock = events[events.length - 1].blockNumber + 1
        }

        _fetchMoreData()
        return setInterval(_fetchMoreData, UPDATE_INTERVAL)
      }

      const intervalId = startFetchData()

      return () => clearInterval(intervalId)
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
      last updated: <DiffTime timestamp={lastUpdateTimestamp} />
      {loadingPercent !== 100 && (
        <progress
          className="progress my-progress is-info"
          value={loadingPercent}
          max="100"
        >
          {loadingPercent}%
        </progress>
      )}
      <div style={{ width: "100%", height: "90%" }} ref={container} />
    </div>
  )
}

export default Network
