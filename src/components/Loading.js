import React from 'react'

function loading(props) {
    const spinner = props.spinner
  return (
    <>
      {spinner ? (
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      ) : (
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      )}
    </>
  )
}

export default loading