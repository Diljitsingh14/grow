export const isExpire = (timestamp: number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
  return timestamp < currentTime;
};
