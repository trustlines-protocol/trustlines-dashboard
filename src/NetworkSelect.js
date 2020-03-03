import React, {useCallback, useEffect, useState} from "react"

import { fetch_endpoint } from "./api.js"

import "./NetworkSelect.css"

function NetworkSelect({ onNetworkSelect }) {
  const [networks, setNetworks] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)

  useEffect(() => {
    async function _fetch() {
      const networks = await fetch_endpoint(
        process.env.REACT_APP_RELAY_URL + `/api/v1/networks`
      )
      networks.sort(
        (networkA, networkB) => networkB.numUsers - networkA.numUsers
      )
      setNetworks(networks)
    }
    _fetch()
  }, [])

  const selectNetwork = useCallback((network) => {
      setSelectedAddress(network.address)
      onNetworkSelect(network)
    },
    [onNetworkSelect, setSelectedAddress]
  )

  return (
    <aside className={"menu my-menu"}>
      <p className={"menu-label"}>Networks</p>
      <ul>
        {networks.map(network => (
          <li key={network.address}>
            <a
              onClick={() => selectNetwork(network)}
              className={
                "list-item " +
                (selectedAddress === network.address ? "is-active" : "")
              }
            >
              {network.name} ({network.numUsers})
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default NetworkSelect
