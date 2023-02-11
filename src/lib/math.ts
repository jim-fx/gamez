export function degreesToRadians(a: number) {
  return a * (Math.PI / 180);
}

export function radiansToDegrees(radians: number) {
  return radians * (180 / Math.PI);
}

export function rotateVec2([x, y]: number[], degrees: number) {
  const radians = degreesToRadians(degrees);
  return [
    x * Math.cos(radians) - y * Math.sin(radians),
    x * Math.sin(radians) + y * Math.cos(radians)
  ]
}

export function addVec(a: number[], b: number[]) {
  return a.map((v, i) => v + b[i]);
}

export function vecLength(vec: number[]) {
  return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
}
