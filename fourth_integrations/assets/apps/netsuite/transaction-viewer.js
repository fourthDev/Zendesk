window.addEventListener ? window.addEventListener('load', initTransactionViewer) : window.attachEvent && window.attachEvent('onload', initTransactionViewer)

async function initTransactionViewer() {
    // Generate Menu Item
    await buildMenuItem('Transaction Viewer', 'transaction-viewer', 'netsuite')

    // Generate App Section
    await buildAppItem()

    viewTransactions()

    async function buildAppItem() {
        return new Promise(async (resolve) => {
            const appContainer = document.querySelector('main#app-container')
            const appList = document.querySelector('section#app-list')
    
            const appSection = document.createElement('section')
            appSection.className = 'app'
            appSection.dataset.app = 'transaction-viewer'
    
            // Build the Return Button
            const returnMenu = document.createElement('section')
            returnMenu.className = 'app-return'
    
            const returnMenuItem = document.createElement('div')
            returnMenuItem.className = 'app-item'
            returnMenuItem.dataset.app = 'return'
            returnMenuItem.addEventListener('click', e => {
                document.querySelector(`section.app[data-app="transaction-viewer"]`).style.display = 'none'
                appList.style.display = 'flex'
            })
    
            const leftChevron = document.createElement('img')
            leftChevron.src = '../icon/chevron-right.svg'
            leftChevron.className = 'chevron-flipped'
            leftChevron.classList.add('menu-icon')
    
            const returnMenuItemName = document.createElement('span')
            returnMenuItemName.className = 'app-title'
            returnMenuItemName.innerText = 'Return to Menu'
    
            returnMenuItem.appendChild(leftChevron)
            returnMenuItem.appendChild(returnMenuItemName)
            returnMenu.appendChild(returnMenuItem)
            appSection.appendChild(returnMenu)
    
            // Build the Alert Text
            const alertItem = document.createElement('div')
            alertItem.className = 'app-alert'
            alertItem.id = `transaction-viewer-alert`
            alertItem.innerText = 'App Alert Text'
    
            appSection.appendChild(alertItem)

            // Build the App Components
            //// Add the App Title
            appSection.appendChild(await buildAppTitle('Recent Transactions'))
    
            appContainer.appendChild(appSection)
            resolve()
        })
    }
    
    async function viewTransactions() {                                                                                    
        const url = 'https://897397.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=721&deploy=1&compid=897397&h=3738b49c2da75cd54e0c&dGhpc0N1c3RvbWVySUQ='

        const appSection = document.querySelector('section[data-app="transaction-viewer"]')
        const transactionTitle = document.querySelector('section[data-app="transaction-viewer"] > h1.app-title')

        const {location} = await client.context()
        
        if (location == 'organization_sidebar') {
            const {organization} = await client.get('organization')

            transactionTitle.innerText = `${organization.name} ${transactionTitle.innerText}`

            const transactionFrame = document.createElement('iframe')
            transactionFrame.className = 'app-results-frame'
            transactionFrame.src = `${url}${organization.organizationFields.netsuite_id}`

            appSection.appendChild(transactionFrame)
        } else if (location == 'user_sidebar') {
            const {user} = await client.get('user')

            user.organizations.forEach((org, index) => {
                if (index == 0) {
                    transactionTitle.innerText = `${org.name} ${transactionTitle.innerText}`
                } else {
                    const newTransactionTitle = document.createElement('h1')
                    newTransactionTitle.className = 'app-title'
                    newTransactionTitle.innerText = `${org.name} Recent Transactions`

                    appSection.appendChild(newTransactionTitle)
                }

                const transactionFrame = document.createElement('iframe')
                transactionFrame.className = 'app-results-frame'
                transactionFrame.src = `${url}${org.organizationFields.netsuite_id}`

                appSection.appendChild(transactionFrame)
            })
        }
    }
}