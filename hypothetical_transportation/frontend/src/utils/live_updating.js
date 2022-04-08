const DELAY = 10000 // 10 seconds

export const runCallEveryPeriod = (callBack, delay = DELAY) => {
    callBack();
    const interval = setInterval(() => {
        console.log('This will run every 10 seconds!');
        callBack();
      }, delay);
    return () => clearInterval(interval);
}