import React, { useEffect, useState } from "react"
import BigNumber from "bignumber.js"

import { fetch_endpoint } from "./api.js"

function format_num(value, network) {
  if (value == null) {
    return "..."
  }
  const num = new BigNumber(value).div(new BigNumber(10).pow(network.decimals))
  return `${num} ${network.abbreviation}`
}

function Account({ network, address }) {
  const [account, setAccount] = useState({})

  useEffect(() => {
    async function _fetch() {
      const account = await fetch_endpoint(
        process.env.REACT_APP_RELAY_URL +
          `/api/v1/networks/${network.address}/users/${address}`
      )
      setAccount(account)
    }
    _fetch()
  }, [network, address])

  return (
    <div>
      <div className={"title"}>Account Details</div>
      <table className="table">
        <tbody>
          <tr>
            <th>User</th>
            <td>{address}</td>
          </tr>
          <tr>
            <th>Credit given</th>
            <td>{format_num(account.given, network)}</td>
          </tr>
          <tr>
            <th>Credit received</th>
            <td>{format_num(account.received, network)}</td>
          </tr>
          <tr>
            <th>Balance</th>
            <td>{format_num(account.balance, network)}</td>
          </tr>
          <tr>
            <th>Available</th>
            <td>{format_num(account.leftReceived, network)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Account
