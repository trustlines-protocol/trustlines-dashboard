import React from "react"

function NetworkInfo({ network }) {
  return (
    <div>
      <div className={"title"}>
        {network.name} ({network.abbreviation})
      </div>
      <div className={"subtitle"}>{network.numUsers} Users</div>
    </div>
  )
}

export default NetworkInfo
