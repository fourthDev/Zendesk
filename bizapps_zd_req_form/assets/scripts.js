let client

window.onload = () => {
    // Initialize the App
    client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '300px' });
}