import { createContext, ReactNode, useState } from 'react';

export interface SettingsContextData {
  showSettings: boolean,
  showSearch: boolean,
  changeShowSettings: () => boolean
  changeShowSearch: () => boolean
}

export const SettingsContext = createContext({} as SettingsContextData);

interface SettingsProviderProps {
  children: ReactNode;
}

export default function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState(false);
  const [search, setSearch] = useState(false);

  const changeShowSettings = () => {
    const tempSettings = !settings;
    setSettings(tempSettings);
    return(tempSettings);
  }

  const changeShowSearch = () => {
    const tempSearch = !search;
    setSearch(tempSearch);
    return(tempSearch);
  }

  return (
    <SettingsContext.Provider
      value={{
        showSettings: settings,
        showSearch: search,
        changeShowSettings,
        changeShowSearch
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
