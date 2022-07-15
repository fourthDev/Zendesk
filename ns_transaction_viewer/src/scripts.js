let client

const BASE_URL = 'https://897397.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=721&deploy=1&compid=897397&h=3738b49c2da75cd54e0c&dGhpc0N1c3RvbWVySUQ='

window.onload = () => {
    // Initialize the App
    client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '300px' });

    client.on('app.registered', async (e) => {
        // Determine what context the app is loaded in
        const appContext = await client.context()
        const appLocation = appContext.location
        
        // Get the NetSuite Organization ID
        await showTransactions(appLocation)
    })
}

const showTransactions = (location) => {
    return new Promise(async (resolve, reject) => {
        if (location == 'organization_sidebar') {
            const {organization} = await client.get('organization')

            const transactionContainer = document.createElement('div')
            transactionContainer.className = 'container'

            const transactionHeader = document.createElement('h4')
            transactionHeader.innerText = `${organization.name} Transaction History`
            transactionContainer.appendChild(transactionHeader)

            const transactionFrame = document.createElement('iframe')
            transactionFrame.src = `${BASE_URL}${organization.organizationFields.netsuite_id}`
            transactionContainer.appendChild(transactionFrame)

            document.querySelector('main#app-container').appendChild(transactionContainer)

            resolve()
        } else if (location == 'user_sidebar') {
            const {user} = await client.get('user')

            user.organizations.forEach(org => {
                const transactionContainer = document.createElement('div')
                transactionContainer.className = 'container'

                const transactionHeader = document.createElement('h4')
                transactionHeader.innerText = `${org.name} Transaction History`
                transactionContainer.appendChild(transactionHeader)

                const transactionFrame = document.createElement('iframe')
                transactionFrame.src = `${BASE_URL}${org.organizationFields.netsuite_id}`
                transactionContainer.appendChild(transactionFrame)

                document.querySelector('main#app-container').appendChild(transactionContainer)
            })

            resolve()
        }
    })
}