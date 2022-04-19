export declare const HandleWidth = 20;
export declare const HandleHeight = 40;
export declare const PositionRight = "right";
export declare const PositionLeft = "left";
export declare const ThemeWhite: string;
export declare const ThemeBlack: string;
export interface ITheme {
    mainBg: string;
    subBg: string;
    main: string;
    sub: string;
    sub2: string;
    line: string;
}
export interface IThemes {
    white: ITheme;
    black: ITheme;
}
export declare const Themes: IThemes;
