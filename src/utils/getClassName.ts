// Concatenate strings and filter out the falsy element to get the class name.
const getClassName = (...cls: string[]) => {
  return cls.filter(Boolean).join(' ');
};

export { getClassName };
