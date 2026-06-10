// OFFLINE CORE MOCK
export const registerPlugin = (name) => {
    console.log(`[Offline] Plugin ${name} registered`);
    // Return a dummy object that handles Haptics
    return {
        tap: async () => { 
            // This gives you the "Crisp" click you want
            if (navigator.vibrate) navigator.vibrate(1); 
        },
        vibrate: async () => { 
            if (navigator.vibrate) navigator.vibrate(1); 
        }
    };
};