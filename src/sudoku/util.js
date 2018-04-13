/**
 *
 *
 * @param {Iterable} iterables
 * @return {Iterable}
 */
export function zip(...iterables) {
  const iterators = iterables.map(i => i[Symbol.iterator]());
  let done = false;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (!done) {
        const items = iterators.map(i => i.next());
        done = items.some(item => item.done);
        if (!done) {
          return { value: items.map(i => i.value) };
        }
        // Done for the first time: close all iterators
        for (const iterator of iterators) {
          if (typeof iterator.return === 'function') {
            iterator.return();
          }
        }
      }
      // We are done
      return { done: true };
    },
  };
}

/**
 *
 *
 * @param {any} string
 * @param {any} width
 * @param {any} padding
 * @return {string}
 */
export function center(string, width, padding) {
  padding = padding || ' ';
  padding = padding.substr(0, 1);
  if (string.length < width) {
    let len = width - string.length;
    let remain = len % 2 == 0 ? '' : padding;
    let pads = padding.repeat(parseInt(len / 2));
    return pads + string + pads + remain;
  } else return string;
}

/**
 * Returns the sum of all the elements of an array
 *
 * @param {any} arr
 * @return {Number}
 */
export function sum(arr) {
  return arr.reduce((sum, x) => sum + x);
}
