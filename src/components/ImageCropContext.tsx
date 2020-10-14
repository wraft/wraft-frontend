import React, { useState, createContext } from 'react'

export const GlobalSpinnerContext = createContext();

const GlobalSpinnerContextProvider = (props) => {
  const [isGlobalSpinnerOn, setGlobalSpinner] = useState(false)

  return (
    <GlobalSpinnerContext.Provider value={{isGlobalSpinnerOn, setGlobalSpinner}}>
        {props.children}
    </GlobalSpinnerContext.Provider>
  )
}

export default GlobalSpinnerContextProvider
