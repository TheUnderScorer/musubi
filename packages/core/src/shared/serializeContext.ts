export function serializeContext<Ctx>(ctx: Ctx) {
  if (typeof ctx === 'object') {
    return Object.entries(ctx as object).reduce((acc, [key, entry]) => {
      return {
        ...acc,
        [key]: safeSerialize(entry),
      };
    }, {});
  }

  return safeSerialize(ctx);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeSerialize<V>(value: V): any {
  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  if (typeof value === 'function') {
    return '[function]';
  }

  if (typeof value === 'object') {
    return serializeContext(value);
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    return '[unserializable]';
  }
}
