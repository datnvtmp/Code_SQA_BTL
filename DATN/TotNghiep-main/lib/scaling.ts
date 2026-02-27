export const BASE_VIEWPORT = {
  width: 375,
  height: 812,
};

export const getDeviceDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 375, height: 812 };
  }
  return { width: window.innerWidth, height: window.innerHeight };
};

// Scale theo width
export const getScaleFactor = (): number => {
  const { width: deviceWidth } = getDeviceDimensions();
  const scaleFactor = deviceWidth / BASE_VIEWPORT.width;
  return scaleFactor;
};



