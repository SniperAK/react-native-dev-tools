import React, { createContext } from 'react';
import { ThemeBlack, ThemeWhite, ITheme, Themes } from '../../commons/defines';
const defaultToolContext: IDevTool = {
  theme: 'white',
  setTheme: () => { },
  axiosLog: undefined,
  asyncStorage: undefined,
  log: undefined,
  navigationContainer: [],
  setNavigationContainer: () => { }
};

const ToolContext = createContext<IDevTool>(defaultToolContext);

interface IProps {
  children: JSX.Element | Array<JSX.Element>;
}

const ToolContextProvider = ({ children }: IProps) => {
  const axiosLog = React.useState<boolean>(false);
  const asyncStorage = React.useState<boolean>(false);
  const log = React.useState<boolean>(false);
  const [navigationContainer, setNavigationContainer] = React.useState([]);
  const [theme, setTheme] = React.useState(ThemeWhite);

  return (
    <ToolContext.Provider
      value={{
        theme,
        setTheme,
        axiosLog,
        asyncStorage,
        log,
        navigationContainer,
        setNavigationContainer
      }}>
      {children}
    </ToolContext.Provider>
  );
};

const setNavigationContainer = (navigationContainer: any) => {
  const { setNavigationContainer } = React.useContext(ToolContext);
  setNavigationContainer(navigationContainer);
}

interface IUseTools extends IDevTool {
  pallete: ITheme;
}

const useTools = (): IUseTools => {
  const value: IDevTool = React.useContext<IDevTool>(ToolContext);
  return {
    ...value,
    pallete: value.theme === ThemeBlack ? Themes.black : Themes.white,
  }
}

export {
  ToolContext,
  ToolContextProvider,
  setNavigationContainer,
  useTools
};
