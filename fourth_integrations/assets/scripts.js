let client

window.onload = () => {
    // Initialize the App
    client = ZAFClient.init()

    const menuTabs = document.querySelectorAll('div.list-label')
    menuTabs.forEach(tab => {
        tab.addEventListener('click', e => {
            const tabContent = document.querySelector(`div.list-content[data-content="${tab.dataset.content}"]`)
            if (tabContent.style.display === 'flex') {
                tabContent.style.display = 'none'
                
                document.querySelector(`div.list-label[data-content="${tab.dataset.content}"] img.chevron-up`).className = 'chevron-down'
            } else {
                tabContent.style.display = 'flex'
                
                document.querySelector(`div.list-label[data-content="${tab.dataset.content}"] img.chevron-down`).className = 'chevron-up'
            }
        })
    })
}

function buildMenuItem(title, appName, section) {
    return new Promise(resolve => {
        const appListContainer = document.querySelector(`section#app-list`)
        const appList = document.querySelector(`section#app-list div#${section}-list div.list-content`)

        const menuItem = document.createElement('div')
        menuItem.className = 'app-item'
        menuItem.dataset.app = appName
        menuItem.addEventListener('click', e => {
            appListContainer.style.display = 'none'
            document.querySelector(`section.app[data-app="${appName}"]`).style.display = 'flex'
        })

        const appTitle = document.createElement('span')
        appTitle.className = 'app-title'
        appTitle.innerText = title

        const rightChevron = document.createElement('img')
        rightChevron.className = 'menu-icon'
        rightChevron.src = '../icon/chevron-right.svg'

        menuItem.appendChild(appTitle)
        menuItem.appendChild(rightChevron)

        appList.appendChild(menuItem)
        appList.parentElement.style.display = 'block'

        resolve()
    })
}

function buildInputItem(labelText, inputName, appName, required) {
    return new Promise((resolve) => {
        const inputWrapper = document.createElement('div')
        inputWrapper.className = 'input-wrapper'

        const inputLabel = document.createElement('label')
        inputLabel.setAttribute('for', `${appName}-${inputName}`)
        inputLabel.innerText = `${labelText}:`
        required ? inputLabel.className = 'required-input' : null

        const inputField = document.createElement('input')
        inputField.setAttribute('type', 'text')
        inputField.id = `${appName}-${inputName}`

        inputWrapper.appendChild(inputLabel)
        inputWrapper.appendChild(inputField)

        resolve(inputWrapper)
    })
}

function buildTextArea(labelText, inputName, appName, required) {
    return new Promise((resolve) => {
        const inputWrapper = document.createElement('div')
        inputWrapper.className = 'input-wrapper'
        inputWrapper.classList.add('input-wrapper-textarea')

        const inputLabel = document.createElement('label')
        inputLabel.setAttribute('for', `${appName}-${inputName}`)
        inputLabel.innerText = `${labelText}:`
        required ? inputLabel.className = 'required-input' : null

        const inputField = document.createElement('textarea')
        inputField.id = `${appName}-${inputName}`
        inputField.rows = '4'

        inputWrapper.appendChild(inputLabel)
        inputWrapper.appendChild(inputField)

        resolve(inputWrapper)
    })
}

function buildSubmitButton(buttonText, appName) {
    return new Promise((resolve) => {
        const submitButton = document.createElement('button')
        submitButton.id = `${appName}-btn`
        submitButton.className = 'submit-btn'
        submitButton.innerText = buttonText
        resolve(submitButton)
    })
}

function buildAppTitle(title) {
    return new Promise((resolve) => {
        const appTitle = document.createElement('h1')
        appTitle.className = 'app-title'
        appTitle.innerText = title
        resolve(appTitle)
    })
}

function buildResultsFrame(appName) {
    return new Promise((resolve) => {
        const resultsFrame = document.createElement('iframe')
        resultsFrame.id = `${appName}-results`
        resultsFrame.className = 'app-results-frame'
        resultsFrame.src = ''
        resolve(resultsFrame)
    })
}