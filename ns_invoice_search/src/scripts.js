let client

const BASE_URL = 'https://forms.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=823&deploy=1&compid=897397&h=449eb6d8ac0a531e17cb&dGhpc0N1c3RvbWVySUQ='

window.onload = () => {
    // Initialize the App
    client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '300px' });

    client.on('app.registered', async (e) => {
        // Determine what context the app is loaded in
        document.querySelector('#search-btn').addEventListener('click', (e) => {
            e.preventDefault()
            const invoiceID = document.querySelector('#invoice-id').value

            searchInvoice(invoiceID)
        })
    })
}

const searchInvoice = (invoiceID) => {
    return new Promise((resolve, reject) => {
        document.querySelector('iframe#search-frame').src = `${BASE_URL}${invoiceID}`

        resolve()
    })
}