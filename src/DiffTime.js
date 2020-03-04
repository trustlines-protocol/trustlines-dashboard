import React, { useEffect, useState } from "react"

import moment from "moment"

function DiffTime({ timestamp }) {
  const [diffTimeString, setDiffTimeString] = useState("")

  useEffect(() => {
    function _update() {
      setDiffTimeString(moment(timestamp).fromNow())
    }
    _update()
    const id = setInterval(_update, 1000)
    return () => clearInterval(id)
  }, [timestamp])

  return (
    timestamp && (
      <span>
        {moment(timestamp).format("hh:mm:ss")}({diffTimeString})
      </span>
    )
  )
}

export default DiffTime
