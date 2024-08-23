import { createContext, useState } from "react";

export const AuthenticatedUserContext = createContext({});
const AuthenticatedUserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  return(
    <AuthenticatedUserContext.Provider value={{user, setUser}}>
        {children}
    </AuthenticatedUserContext.Provider>
  )
};

export default AuthenticatedUserProvider;