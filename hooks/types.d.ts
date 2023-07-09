declare const __webpack_init_sharing__: (scope: string) => Promise<void>;

declare const __webpack_share_scopes__: Record<
  string,
  Record<
    string,
    { loaded?: 1; get: () => Promise<unknown>; from: string; eager: boolean }
  >
>;
