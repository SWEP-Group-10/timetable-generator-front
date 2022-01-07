import { useContext, createContext, useState } from "react";

const authContext = createContext();

export function useAuth() {
    return useContext(authContext);
}

function useProvideAuth() {
    const [bearerToken, setBearerToken] = useState("");
  
    return {
      bearerToken,
      setBearerToken
    };
}

export default function ProvideAuth({children}) {
    const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}