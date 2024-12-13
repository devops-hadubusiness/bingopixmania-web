// packages
import React, { useState, createContext } from "react";
import { Socket } from "socket.io-client";

interface ICampaignDetailsContext {
  socketIOClient: Socket | null;
  updateCampaignDetailsWebsocket(socketIOClient: Socket | null): void;
}

// types
type CampaignDetailsContextProps = {
  children: Readonly<React.ReactNode>;
};

// context
const CampaignDetailsContext = createContext<ICampaignDetailsContext>({
  socketIOClient: null,
  updateCampaignDetailsWebsocket: () => {},
});

const CampaignDetailsContextProvider = ({ children }: CampaignDetailsContextProps) => {
  const [socketIOClient, setSocketIOClient] = useState<Socket | null>(null);

  const updateCampaignDetailsWebsocket = (client: Socket | null): void => {
    setSocketIOClient(client);
  };

  return (
    <CampaignDetailsContext.Provider
      value={{
        socketIOClient,
        updateCampaignDetailsWebsocket,
      }}
    >
      {children}
    </CampaignDetailsContext.Provider>
  );
};

export { CampaignDetailsContext, CampaignDetailsContextProvider };
