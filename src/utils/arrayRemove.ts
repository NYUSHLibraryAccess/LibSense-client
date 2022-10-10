// Remove an element from an array.
const arrayRemove = <T>(array: T[], itemToRemove: T): T[] => {
  return array.filter((item) => item !== itemToRemove);
};

export { arrayRemove };
