export const HandleWidth = 20;
export const HandleHeight = 40;

export const PositionRight = 'right';
export const PositionLeft = 'left';

export const ThemeWhite: string = 'white';
export const ThemeBlack: string = 'black';

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

export const Themes: IThemes = {
  white: {
    mainBg: '#fff',
    subBg: '#fafafa',
    main: '#333',
    sub: '#666',
    sub2: '#999',
    line: '#eaeaea'
  },
  black: {
    mainBg: '#000',
    subBg: '#333',
    main: 'white',
    sub: '#ee',
    sub2: '#ccc',
    line: '#eaeaea'
  },
};
