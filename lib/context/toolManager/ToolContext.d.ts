import React from 'react';
import { ITheme } from '../../commons/defines';
declare const ToolContext: React.Context<IDevTool>;
interface IProps {
    children: JSX.Element | Array<JSX.Element>;
}
declare const ToolContextProvider: ({ children }: IProps) => JSX.Element;
declare const setNavigationContainer: (navigationContainer: any) => void;
interface IUseTools extends IDevTool {
    pallete: ITheme;
}
declare const useTools: () => IUseTools;
export { ToolContext, ToolContextProvider, setNavigationContainer, useTools };
