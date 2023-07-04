declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module '*.woff';
declare module '*.woff2';
declare module '*.css';
declare module '*.sass';
declare module '*.scss';
declare module '*.less';

/** Application name. */
declare const __NAME__: string;

/** Version number of the application. */
declare const __VERSION__: string;

/** Whether the build is in development mode or not. */
declare const __IS_DEV__: boolean;

/** Build timestamp of the application. */
declare const __BUILD_TIMESTAMP__: string;
