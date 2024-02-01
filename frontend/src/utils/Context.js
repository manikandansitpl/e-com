import { createContext, useContext, useState } from "react";

const ContextProvider = createContext()

const ContextWrapper =({children})=>{
    const [Brand,setBrand] = useState([])
    return(
        <ContextProvider.Provider value={{
            Brand,setBrand
        }}>
            {children}
        </ContextProvider.Provider>
    )
}

export const GlobalState =()=>useContext(ContextProvider);
export default ContextWrapper;