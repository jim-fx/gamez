export function withSubComponents<A, B extends Record<string, any>>(
  component: A,
  subcomponents: B
): A & B {
  Object.keys(subcomponents).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)[key] = (subcomponents as any)[key];
  });
  return component as A & B;
}

