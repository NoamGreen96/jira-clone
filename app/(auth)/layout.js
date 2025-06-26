import React from "react"

const Layout = ({ children }) => {
  return (
    <div className="flex justify-center pt-20 pb-5 min-h-screen px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

export default Layout
