window.addEventListener ? window.addEventListener('load', initInvoiceSearch) : window.attachEvent && window.attachEvent('onload', initInvoiceSearch)

async function initInvoiceSearch() {
    // Generate Menu Item
    await buildMenuItem('Invoice Search', 'invoice-search', 'netsuite')

    // Generate App Section
    await buildAppItem()

    async function buildAppItem() {
        return new Promise(async (resolve) => {
            const appContainer = document.querySelector('main#app-container')
            const appList = document.querySelector('section#app-list')
    
            const appSection = document.createElement('section')
            appSection.className = 'app'
            appSection.dataset.app = 'invoice-search'
    
            // Build the Return Button
            const returnMenu = document.createElement('section')
            returnMenu.className = 'app-return'
    
            const returnMenuItem = document.createElement('div')
            returnMenuItem.className = 'app-item'
            returnMenuItem.dataset.app = 'return'
            returnMenuItem.addEventListener('click', e => {
                document.querySelector(`section.app[data-app="invoice-search"]`).style.display = 'none'
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
            alertItem.id = `invoice-search-alert`
            alertItem.innerText = 'App Alert Text'
    
            appSection.appendChild(alertItem)
    
            // Build the App Components
            //// Add the App Title
            appSection.appendChild(await buildAppTitle('Invoice Lookup'))
    
            //// Add an Input Section
            const inputSection = document.createElement('div')
            inputSection.id = 'invoice-search-input'
            inputSection.className = 'app-inputs'
    
            inputSection.appendChild(await buildInputItem('Invoice ID', 'id', 'invoice-search'))
    
            appSection.appendChild(inputSection)
    
            //// Add a Submit Button
            const submitButton = await buildSubmitButton('Search', 'invoice-search')
            submitButton.addEventListener('click', e => { invoiceSearch() })
            appSection.appendChild(submitButton)
    
            //// Add a Results Frame
            appSection.appendChild(await buildResultsFrame('invoice-search'))
    
            appContainer.appendChild(appSection)
            resolve()
        })
    }
    
    async function invoiceSearch() {
        const url = `https://forms.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=823&deploy=1&compid=897397&h=449eb6d8ac0a531e17cb&dGhpc0N1c3RvbWVySUQ=`
        const id = document.querySelector('input#invoice-search-id').value
        const frame = document.querySelector('iframe#invoice-search-results')
    
        frame.src = `${url}${id}`
    }
}