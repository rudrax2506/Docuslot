import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvier = (props) => {

    const value = {

    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvier