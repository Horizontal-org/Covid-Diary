
export const fToCel = (fTemp: number) => Math.round((((fTemp/10) - 32) * 5 / 9) * 100)/10;
export const CToFar = (cTemp: number) => Math.round(((cTemp/10) * 9 / 5 + 32) * 100)/10;
