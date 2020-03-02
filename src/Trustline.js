import React, { useEffect, useState } from "react"
import BigNumber from "bignumber.js"

import { fetch_endpoint } from "./api.js"

function format_num(value, network) {
  const num = new BigNumber(value).div(new BigNumber(10).pow(network.decimals))
  return `${num} ${network.abbreviation}`
}

function Trustline({ network, from, to }) {
  const [trustline, setTrustline] = useState({})

  useEffect(() => {
    async function _fetch() {
      const trustline = await fetch_endpoint(
        process.env.REACT_APP_RELAY_URL +
          `/api/v1/networks/${network.address}/users/${from}/trustlines/${to}`
      )
      setTrustline(trustline)
    }
    _fetch()
  }, [network, from, to])

  return (
    <div>
      <div className={"title"}>Trustline Details</div>
      <table className="table">
        <tbody>
          <tr>
            <th>from</th>
            <td>{trustline.user}</td>
          </tr>
          <tr>
            <th>to</th>
            <td>{trustline.counterParty}</td>
          </tr>
          <tr>
            <th>Credit given</th>
            <td>{format_num(trustline.given, network)}</td>
          </tr>
          <tr>
            <th>Credit received</th>
            <td>{format_num(trustline.received, network)}</td>
          </tr>
          <tr>
            <th>Balance</th>
            <td>{format_num(trustline.balance, network)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Trustline
