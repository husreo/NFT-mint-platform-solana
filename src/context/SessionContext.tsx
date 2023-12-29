import { createContext, useContext } from "react";
import { Session } from "next-auth";

// Define the session context type
type SessionContextType = {
  session: Session | null;
};

// Create the session context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Export a custom hook to access the session context
export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionContextProvider");
  }
  return context;
};

// Export the session context
export default SessionContext;
