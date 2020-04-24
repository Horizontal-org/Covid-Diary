
export const fToCel = (fTemp: number) => Math.round(((fTemp - 320) * 5 / 9) * 10)/10;
export const CToFar = (cTemp: number) => Math.round(((cTemp/10) * 9 / 5 + 32) * 100)/10;
