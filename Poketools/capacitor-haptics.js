export const Haptics = {
    vibrate: async () => {
        if (navigator.vibrate) navigator.vibrate(1); 
    },
    impact: async () => {
         // Change 5 to 1 here
         if (navigator.vibrate) navigator.vibrate(1);
    },
    notification: async () => {
         if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
    }
};