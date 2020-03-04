import React, { useCallback, useState } from "react"

import Network from "./Network"
import NetworkSelect from "./NetworkSelect"
import NetworkInfo from "./NetworkInfo"
import Trustline from "./Trustline"
import Account from "./Account"

import "bulma/css/bulma.css"
import "./App.css"

function App() {
  const [network, setNetwork] = useState(null)
  const [trustline, setTrustline] = useState(null)
  const [account, setAccount] = useState(null)

  const handleSelectNetwork = useCallback(network => {
    setTrustline(null)
    setAccount(null)
    setNetwork(network)
  }, [])

  return (
    <div className={"mycontainer columns"}>
      <div className={"column is-narrow"}>
        <NetworkSelect onNetworkSelect={handleSelectNetwork} />
      </div>
      <div className={"column is-three-quarter"}>
        {network && <NetworkInfo network={network} />}
        {network ? (
          <Network
            address={network.address}
            onSelectTrustline={setTrustline}
            onSelectAccount={setAccount}
          />
        ) : (
          <div className={"has-text-centered"}>Select a network</div>
        )}
      </div>
      <div className={"column is-one-quarter"}>
        {trustline ? (
          <Trustline
            network={network}
            from={trustline.from}
            to={trustline.to}
          />
        ) : (
          <div className={"has-text-centered"}>Select a trustline</div>
        )}
        <br />
        <br />
        {account ? (
          <Account network={network} address={account} />
        ) : (
          <div className={"has-text-centered"}>Select an account</div>
        )}
      </div>
    </div>
  )
}

export default App
