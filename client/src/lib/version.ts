/**
 * Build metadata injected by `define` in vite.config.ts.
 * The globals are declared in src/vite-env.d.ts.
 */
export const APP_VERSION: string = __APP_VERSION__;
export const APP_COMMIT: string = __APP_COMMIT__;
export const APP_BUILD_TIME: string = __APP_BUILD_TIME__;
export const IS_DEV_BUILD: boolean = import.meta.env.DEV;
export const REPO_URL = "https://github.com/mekanhaji/share-clipboard";
