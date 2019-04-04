// from fbjs

const resolvedPromise = Promise.resolve();

function throwNext(error) {
  setTimeout(() => {
    throw error;
  }, 0);
}

/**
 * An alternative to setImmediate based on Promise.
 */
export default function resolveImmediate(callback: () => any): Promise<void> {
  return resolvedPromise.then(callback).catch(throwNext);
}