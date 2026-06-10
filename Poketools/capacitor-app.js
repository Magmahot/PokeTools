// OFFLINE APP MOCK
export const App = {
    addListener: (eventName, callback) => {
        if (eventName === 'backButton') {
            // Simulate back button handling for browser
            window.addEventListener('popstate', () => {
                callback({ canGoBack: true });
            });
        }
        return Promise.resolve({ remove: () => {} });
    },
    exitApp: () => {
        console.log('App Exit Requested (Ignored in Browser)');
    }
};