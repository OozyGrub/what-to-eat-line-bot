export const buildOrQuery = (expressions: string[]) => {
  return `OR(${expressions.join(",")})`;
};
