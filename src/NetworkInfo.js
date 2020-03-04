import React from "react"

function NetworkInfo({ networkStatic, numUsers, numTransfers }) {
  return (
    <div>
      <div className={"title"}>
        {networkStatic.name} ({networkStatic.abbreviation})
      </div>
      <div className={"subtitle"}>
        {numUsers} Users, {numTransfers} Transfers
      </div>
    </div>
  )
}

export default NetworkInfo
