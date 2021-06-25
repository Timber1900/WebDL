import { createContext, ReactNode, useState } from 'react';

export interface SettingsContextData {
  showSettings: boolean,
  changeShowSettings: () => boolean
}

export const SettingsContext = createContext({} as SettingsContextData);

interface SettingsProviderProps {
  children: ReactNode;
}

export default function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState(false);

  const changeShowSettings = () => {
    const tempSettings = !settings;
    setSettings(tempSettings);
    return(tempSettings);
  }

  return (
    <SettingsContext.Provider
      value={{
        showSettings: settings,
        changeShowSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
