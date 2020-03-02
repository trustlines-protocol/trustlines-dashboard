import React, { useEffect, useState } from "react"

import { fetch_endpoint } from "./api.js"

import "./NetworkSelect.css"

function NetworkSelect({ onNetworkSelect }) {
  const [networks, setNetworks] = useState([])

  useEffect(() => {
    async function _fetch() {
      const networks = await fetch_endpoint(
        process.env.REACT_APP_RELAY_URL + `/api/v1/networks`
      )
      setNetworks(networks)
    }
    _fetch()
  }, [])

  return (
    <div className={"list is-hoverable my-list"}>
      {networks.map(network => (
        <a
          onClick={() => onNetworkSelect(network)}
          className={"list-item"}
          key={network.address}
        >
          {network.name}
        </a>
      ))}
    </div>
  )
}

export default NetworkSelect
