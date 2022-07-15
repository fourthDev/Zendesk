// This file was originally called create-lead.js but was renamed to new-lead due to loading issues...
// Turns out that "create-lead.js" is on a popular adblock list so users with adblock extensions could not load this file.

window.addEventListener ? window.addEventListener('load', initCreateLead) : window.attachEvent && window.attachEvent('onload', initCreateLead)

async function initCreateLead() {
    // Generate Menu Item
    await buildMenuItem('Create Lead', 'create-lead', 'salesforce')

    // Generate App Section
    await buildAppItem()

    // Prefill the Form Data
    await prefillFormData()

    // Check for Existing Leads
    await checkExistingLeads()

    async function buildAppItem() {
        return new Promise(async (resolve) => {
            const appContainer = document.querySelector('main#app-container')
            const appList = document.querySelector('section#app-list')
    
            const appSection = document.createElement('section')
            appSection.className = 'app'
            appSection.dataset.app = 'create-lead'
    
            // Build the Return Button
            const returnMenu = document.createElement('section')
            returnMenu.className = 'app-return'
    
            const returnMenuItem = document.createElement('div')
            returnMenuItem.className = 'app-item'
            returnMenuItem.dataset.app = 'return'
            returnMenuItem.addEventListener('click', e => {
                document.querySelector(`section.app[data-app="create-lead"]`).style.display = 'none'
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
    
            // Build the App Components
            //// Add the App Title
            appSection.appendChild(await buildAppTitle('Create Salesforce Lead'))
    
            //// Add an Input Section
            const inputSection = document.createElement('div')
            inputSection.id = 'create-lead-input'
            inputSection.className = 'app-inputs'
    
            inputSection.appendChild(await buildInputItem('First Name*', 'first-name', 'create-lead', true))
            inputSection.appendChild(await buildInputItem('Last Name*', 'last-name', 'create-lead', true))
            inputSection.appendChild(await buildInputItem('Email*', 'email', 'create-lead', true))
            inputSection.appendChild(await buildInputItem('Company*', 'company', 'create-lead', true))
            inputSection.appendChild(await buildInputItem('Phone', 'phone', 'create-lead'))
            inputSection.appendChild(await buildInputItem('Job Title', 'title', 'create-lead'))
            inputSection.appendChild(await buildInputItem('Address', 'address', 'create-lead'))
            inputSection.appendChild(await buildTextArea('Summary*', 'summary', 'create-lead', true))
    
            appSection.appendChild(inputSection)
    
            //// Build the Alert Text
            const alertItem = document.createElement('div')
            alertItem.className = 'app-alert'
            alertItem.id = `create-lead-alert`
            alertItem.innerText = 'App Alert Text'
    
            appSection.appendChild(alertItem)

            //// Build the Success Text
            const successItem = document.createElement('div')
            successItem.className = 'app-success'
            successItem.id = 'create-lead-success'
            successItem.innerText = 'App Success Text'

            appSection.appendChild(successItem)


            //// 12/1/21 - Build the Confirm Link
            const confirmLink = document.createElement('a')
            confirmLink.className = 'app-confirm-link'
            confirmLink.id = 'create-lead-confirm-link'
            confirmLink.innerText = 'App confirm Link'

            appSection.appendChild(confirmLink)  


            //// Build the Success Link
            const successLink = document.createElement('a')
            successLink.className = 'app-success-link'
            successLink.id = 'create-lead-success-link'
            successLink.innerText = 'App Success Link'
            successLink.target = '_blank'

            appSection.appendChild(successLink)


            //// Add a Submit Button
            const submitButton = await buildSubmitButton('Submit', 'create-lead')
            submitButton.addEventListener('click', e => { createLead() })
            submitButton.disabled = true
            appSection.appendChild(submitButton)
    
            appContainer.appendChild(appSection)
            resolve()
        })
    }

    async function prefillFormData() {
        return new Promise(async (resolve) => {
            const requester = await client.get('ticket.requester')
            const {ticket} = await client.get('ticket')
            const requesterTitle = await client.get('ticket.requester.customField:job_title')

            // Try to prefill the username. May not work if the users name is a single word
            try {
                const requesterName = requester['ticket.requester'].name.split(' ')
                
                document.querySelector('#create-lead-first-name').value = requesterName[0]
                document.querySelector('#create-lead-last-name').value = requesterName[1]
            } catch(e) { console.log(`Failed to Prefill Name: ${e}`) }
            
            // Try to prefill the users email address.
            try {
                const requesterEmail = requester['ticket.requester'].email

                document.querySelector('#create-lead-email').value = requesterEmail
            } catch(e) { console.log(`Failed to Prefill Email: ${e}`) }

            // Try to prefill the users phone number.
            try {
                const requesterPhone = requester['ticket.requester'].phone

                requesterPhone ? document.querySelector('#create-lead-phone').value = requesterPhone : null
            } catch(e) { console.log(`Failed to Prefill Phone: ${e}`) }

            // Try to prefill the users organization.
            try {
                const requesterCompany = requester['ticket.requester'].organizations[0]

                document.querySelector('#create-lead-company').value = requesterCompany.name
            } catch(e) { console.log(`Failed to Prefill Organization: ${e}`) }

            // Try to prefill the Job Title.
            try {
                document.querySelector('#create-lead-title').value = requesterTitle['ticket.requester.customField:job_title']
            } catch(e) { console.log(`Failed to Prefill Job Title: ${e}`) }

            // Try to prefill the ticket summary.
            try {
                const ticketDescription = ticket.description

                document.querySelector('#create-lead-summary').value = ticketDescription
            } catch(e) { console.log(`Failed to Prefill Summary: ${e}`) }

            // Try to prefill the organizations address.
            try {
                const requesterCompany = requester['ticket.requester'].organizations[0]

                const companyAddress = {
                    Street: `${requesterCompany.organizationFields.billingaddressaddr1}`.replace(/null/g, ''),
                    City: `${requesterCompany.organizationFields.billingaddresscity}`.replace(/null/g, ''),
                    Country: `${requesterCompany.organizationFields.billingaddresscountry}`.replace(/null/g, ''),
                    State: `${requesterCompany.organizationFields.billingaddressstate}`.replace(/null/g, ''),
                    Zip: `${requesterCompany.organizationFields.billingaddresszip}`.replace(/null/g, '')
                }

                requesterCompany.organizationFields.billingaddressaddr2 ? companyAddress.Street += ` ${requesterCompany.organizationFields.billingaddressaddr2}` : null
                requesterCompany.organizationFields.billingaddressaddr3 ? companyAddress.Street += ` ${requesterCompany.organizationFields.billingaddressaddr3}` : null

                document.querySelector('#create-lead-address').value = `${companyAddress.Street}, ${companyAddress.City} ${companyAddress.State} ${companyAddress.Country}, ${companyAddress.Zip}`
            } catch(e) { console.log(`Failed to Prefill Address: ${e}`) }

            resolve()
        })
    }

    // 12/1/21 - Added Salesforce trigger parameter.
    async function checkExistingLeads(updateSalesforce) {
        return new Promise(async (resolve, reject) => {
            try {
                const userEmail = document.querySelector(`input#create-lead-email`).value

                const accessToken = await getAccessToken()

                const leadSearch = await client.request({
                    type: 'GET',
                    headers: {
                        "Authorization": `Bearer ${accessToken.access_token}`
                    },
                    url: `https://hs.my.salesforce.com/services/data/v53.0/query/?q=SELECT Id FROM Lead WHERE Email = '${userEmail}' ORDER BY CreatedDate DESC`,
                    contentType: 'application/json',
                    dataType: 'json'
                })

                if (leadSearch.totalSize > 0) {
                    // Display Success Message and Hide the form
                    document.querySelector('section[data-app="create-lead"] h1.app-title').style.display = 'none'
                    document.querySelector('div#create-lead-input').style.display = 'none'
                    document.querySelector('button#create-lead-btn').style.display = 'none'

                    let success = document.querySelector('div#create-lead-success')
                    success.innerText = 'Lead Already Exists'
                    success.style.display = 'block'

                    // 12/1/21 - Added new trigger button for Salesforce update.
                    let confirmLink = document.querySelector('a#create-lead-confirm-link')
                    confirmLink.innerText = 'Click to Update Salesforce'
                    confirmLink.style.display = 'block'
                    confirmLink.href = `#`

                    const successLink = document.querySelector('a#create-lead-success-link')
                    successLink.innerText = 'Click to View Lead'
                    successLink.style.display = 'block'
                    successLink.href = `https://hs.lightning.force.com/lightning/r/Lead/${leadSearch.records[0].Id}/view`

                    // 12/1/21 - Added listener for element click.
                    confirmLink.addEventListener('click', e => {checkExistingLeads('confirmed')})

                    // 12/1/21 - Added conditional statement to check for parameter value. 
                    if (updateSalesforce === 'confirmed'){ 
                        // Update existing lead with new zendesk engagement time. jcr 11/22/21 Commented out existing lead updates. Needs a user-initiated trigger. 
                        try {
                            await client.request({
                                type: 'PATCH',
                                headers: {
                                    "Authorization": `Bearer ${accessToken.access_token}`
                                },
                                url: `https://hs.my.salesforce.com/services/data/v53.0/sobjects/Lead/${leadSearch.records[0].Id}`,
                                contentType: 'application/json',
                                dataType: 'json',
                                data: JSON.stringify({
                                    OwnerID: '00G38000002gdzX',
                                    Status: 'MQL/Marketing Qualified',
                                    "Zendesk_Lead__c": true,
                                    "Zendesk_Engagement_Time__c": await getTimestamp()
                                })
                            })
                            console.log("Ran JSON")
                            // 12/1/21 - Added Success Message to confirm Saleforce JSON update.
                            success = document.querySelector('div#create-lead-success')
                            success.innerText = 'Salesforce Updated!'
                            success.style.display = 'block'
                            
                            // 12/1/21 - Added hide element after click.
                            confirmLink = document.querySelector('a#create-lead-confirm-link')
                            confirmLink.innerText = 'Salesforce Updated!'
                            confirmLink.style.display = 'none'
                            console.log("Salesforce Updated")

                        } catch(e) {
                            // Failed to update zendesk engagement time on existing lead...
                        }
                    }

                } else {
                    document.querySelector('button#create-lead-btn').disabled = false
                }
            } catch(e) {
                console.log(e)
            }

            resolve()
        })
    }
    
    async function createLead() {
        document.querySelector('button#create-lead-btn').disabled = true

        const requester = await client.get('ticket.requester')
        const requesterCompany = requester['ticket.requester'].organizations[0]

        let companyStreet = requesterCompany.organizationFields.billingaddressaddr1  
        requesterCompany.organizationFields.billingaddressaddr2 ? companyStreet += ` ${requesterCompany.organizationFields.billingaddressaddr2}` : null
        requesterCompany.organizationFields.billingaddressaddr3 ? companyStreet += ` ${requesterCompany.organizationFields.billingaddressaddr3}` : null


        const formData = {
            FirstName: document.querySelector(`input#create-lead-first-name`).value,
            LastName: document.querySelector(`input#create-lead-last-name`).value,
            Email: document.querySelector(`input#create-lead-email`).value,
            MobilePhone: document.querySelector(`input#create-lead-phone`).value,
            Company: document.querySelector(`input#create-lead-company`).value,
            LeadSource: 'Zendesk',
            Status: 'MQL/Marketing Qualified',
            OwnerID: '00G38000002gdzX',
            City: requesterCompany.organizationFields.billingaddresscity,
            CountryCode: requesterCompany.organizationFields.billingaddresscountry,
            PostalCode: requesterCompany.organizationFields.billingaddresszip,
            StateCode: requesterCompany.organizationFields.billingaddressstate,
            Street: companyStreet,
            Title: document.querySelector(`input#create-lead-title`).value,
            "Qualification_Summary__c": document.querySelector(`textarea#create-lead-summary`).value,
            "Zendesk_Lead__c": true,
            "Zendesk_Engagement_Time__c": await getTimestamp()
        }

        if (formData.FirstName && formData.LastName && formData.Email && formData.Company && formData["Qualification_Summary__c"]) {
            const accessToken = await getAccessToken()
            
            let newLead
            try {
                newLead = await client.request({
                    type: 'POST',
                    headers: {
                        "Authorization": `Bearer ${accessToken.access_token}`
                    },
                    url: 'https://hs.my.salesforce.com/services/data/v53.0/sobjects/Lead/',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(formData)
                })
            } catch(e) {
                // Handle Error SF Rejection
                console.log(e)
                const alert = document.querySelector('div#create-lead-alert')
                alert.innerText = 'Error: Salesforce Rejection'
                alert.style.display = 'block'
            }

            // Check for newLead success condition
            if (newLead?.success) {
                // Display Success Message and Hide the form
                document.querySelector('section[data-app="create-lead"] h1.app-title').style.display = 'none'
                document.querySelector('div#create-lead-input').style.display = 'none'
                document.querySelector('button#create-lead-btn').style.display = 'none'

                const success = document.querySelector('div#create-lead-success')
                success.innerText = 'Lead Created Successfully'
                success.style.display = 'block'

                const successLink = document.querySelector('a#create-lead-success-link')
                successLink.innerText = 'Click Here to View Lead'
                successLink.style.display = 'block'
                successLink.href = `https://hs.lightning.force.com/lightning/r/Lead/${newLead.id}/view`
            } else {
                // Display Error Message and Enable the button
                const alert = document.querySelector('div#create-lead-alert')
                alert.innerText = 'Error: Salesforce Rejection'
                alert.style.display = 'block'
            }
        } else {
            const alert = document.querySelector('div#create-lead-alert')
            alert.innerText = 'Please Fill Out Required Fields (*)'
            alert.style.display = 'block'

            setTimeout(() => {
                alert.style.display = 'none'

                document.querySelector('button#create-lead-btn').disabled = false
            }, 5000)
        }
    }

    async function getAccessToken() {
        return new Promise(async (resolve, reject) => {
            try {
                const {settings} = await client.metadata()

                // In Prod this will be a login.salesforce.com address vs a test.salesforce.com address
                const token = await client.request({
                    type: 'POST',
                    url: `https://login.salesforce.com/services/oauth2/token?grant_type=password&username=${settings.salesforce_username}&password=${settings.salesforce_password}&client_id=${settings.salesforce_clientid}&client_secret=${settings.salesforce_clientsecret}`
                })

                resolve(token)
            } catch(e) {
                console.log(e)
            }
        })
    }

    async function getTimestamp() {
        return new Promise(async (resolve, reject) => {
            try {
                // https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_valid_date_formats.htm
                // yyyy-MM-ddTHH:mm:ss-06:00
                let currentTime = new Date()

                let timePieces = {
                    year: currentTime.getFullYear().toString(),
                    month: (currentTime.getMonth()+1).toString(),
                    day: currentTime.getDate().toString(),
                    hours: currentTime.getHours().toString(),
                    minutes: currentTime.getMinutes().toString(),
                    seconds: currentTime.getSeconds().toString()
                }

                let sfTimestamp = ``

                sfTimestamp += `${timePieces.year}-`
                if (timePieces.month.length == 1) { sfTimestamp+= `0${timePieces.month}-` } else { sfTimestamp += `${timePieces.month}-` }
                if (timePieces.day.length == 1) { sfTimestamp+= `0${timePieces.day}T` } else { sfTimestamp += `${timePieces.day}T` }
                if (timePieces.hours.length == 1) { sfTimestamp+= `0${timePieces.hours}:` } else { sfTimestamp += `${timePieces.hours}:` }
                if (timePieces.minutes.length == 1) { sfTimestamp+= `0${timePieces.minutes}:` } else { sfTimestamp += `${timePieces.minutes}:` }
                if (timePieces.seconds.length == 1) { sfTimestamp+= `0${timePieces.seconds}-06:00` } else { sfTimestamp += `${timePieces.seconds}-06:00` }

                resolve(sfTimestamp)
            } catch(e) {
                console.log(e)
            }
        })
    }
}