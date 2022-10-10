// Get the SHA256 hash of the string.
const getSHA256 = async (message: string) => {
  // Referenced code from https://gist.github.com/chrisveness/e5a07769d06ed02a2587df16742d3fdd.

  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
  return Array.from(new Uint8Array(buffer))
    .map((num) => num.toString(16).padStart(2, '0'))
    .join('');
};

export { getSHA256 };
