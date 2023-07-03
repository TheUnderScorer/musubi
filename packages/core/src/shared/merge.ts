type Merge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof A & keyof B
    ? Merge<A[K], B[K]>
    : K extends keyof A
    ? A[K]
    : K extends keyof B
    ? B[K]
    : never;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MergeAll<T extends any[]> = T extends [infer Head, ...infer Rest]
  ? Merge<Head, MergeAll<Rest>>
  : object;
