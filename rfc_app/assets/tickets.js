let client

window.onload = () => {
    // Initialize the App
    client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '300px' });

    client.on('app.registered', async (e) => {
        // Determine what context the app is loaded in
        const appContext = await client.context()
        const appLocation = appContext.location

        if (appLocation === 'new_ticket_sidebar') {
            // 360001185291 Ticket Form
            // 360002049531 sandbox
            client.set('ticket.form.id', 360001185291)
        }
        const rfc_tags = await client.get('ticket.tags');
        const fieldDataMX = rfc_tags['ticket.tags'];

        if (fieldDataMX.includes('macromatix_qsr_rfc_cfa') || fieldDataMX.includes('macromatix_qsr_rfc') || fieldDataMX.includes('macromatix_qsr_rfc_mdcn')) {
            // Hide the Fields

            // 360037808152 Change Targets affected
            // XXXXXXXXXXXX Sandbox
            client.invoke('ticketFields:custom_field_360037808152.hide')

            // 360037812472 Change start date
            // 360045480711 sandbox
            client.invoke('ticketFields:custom_field_360037812472.hide')

            // 360037816752 Change start time
            // 360045449272 sandbox
            client.invoke('ticketFields:custom_field_360037816752.hide')

            // 360037809632 Multi-region change
            // 360045480571 sandbox
            client.invoke('ticketFields:custom_field_360037809632.hide')

            // 360037809812 Select Region
            // 360045480071 sandbox
            client.invoke('ticketFields:custom_field_360037809812.hide')

            // 360040397152 Change Duration
            // 1900000085127 sandbox
            client.invoke('ticketFields:custom_field_360040397152.hide')
        }

        // When the RFC Module is changed, check if MX form changes are needed
        // 360038929832 RFC Module
        // 1900000085527 sandbox
        client.on('ticket.custom_field_360038929832.changed', async (e) => {
            const fieldInfo = e

            if (fieldInfo.includes('macromatix')) {
                // Hide the Fields

                // 360037808152 Change Targets affected
                // XXXXXXXXXXXX Sandbox
                client.invoke('ticketFields:custom_field_360037808152.hide')

                // 360037812472 Change start date
                // 360045480711 sandbox
                client.invoke('ticketFields:custom_field_360037812472.hide')

                // 360037816752 Change start time
                // 360045449272 sandbox
                client.invoke('ticketFields:custom_field_360037816752.hide')

                // 360037809632 Multi-region change
                // 360045480571 sandbox
                client.invoke('ticketFields:custom_field_360037809632.hide')

                // 360037809812 Select Region
                // 360045480071 sandbox
                client.invoke('ticketFields:custom_field_360037809812.hide')

                // 360040397152 Change Duration
                // 1900000085127 sandbox
                client.invoke('ticketFields:custom_field_360040397152.hide')
            } else {
                // Show the Fields

                // 360037808152 Change Targets affected
                // XXXXXXXXXXXX Sandbox
                client.invoke('ticketFields:custom_field_360037808152.show')

                // 360037812472 Change start date
                // 360045480711 sandbox
                client.invoke('ticketFields:custom_field_360037812472.show')

                // 360037816752 Change start time
                // 360045449272 sandbox
                client.invoke('ticketFields:custom_field_360037816752.show')

                // 360037809632 Multi-region change
                // 360045480571 sandbox
                client.invoke('ticketFields:custom_field_360037809632.show')

                // 360037809812 Select Region
                // 360045480071 sandbox
                client.invoke('ticketFields:custom_field_360037809812.show')

                // 360040397152 Change Duration
                // 1900000085127 sandbox
                client.invoke('ticketFields:custom_field_360040397152.show')
            }
        })

        // When a macro is applied, check it for RFC macro
        client.on('ticket.subject.changed', async (e) => {
            const fieldInfo = fieldData.filter(data => data.subject == e)

            if (fieldInfo[0]) {
                // 360037118232 Implementation Plan
                // 1900001334167 sandbox
                client.set('ticket.customField:custom_field_360037118232', fieldInfo[0].implementation)

                // 360037118252 Rollback Plan
                // 360047695971 sandbox
                client.set('ticket.customField:custom_field_360037118252', fieldInfo[0].rollback)

                // 360037812312 QA Summary
                // 1900000085067 sandbox
                client.set('ticket.customField:custom_field_360037812312', fieldInfo[0].qa)

                // 360041749471 Description
                // 360045478731 sandbox
                client.set('ticket.customField:custom_field_360041749471', fieldInfo[0].description)
            }
        })

        // When a ticket is submitted, check for Macromatix form changes
        client.on('ticket.save', async function () {
            // Return true to save the ticket
            // Return false to deny the submission

            if (appLocation === 'new_ticket_sidebar') {
                const ticketForm = await client.get('ticket.form')

                // 360001185291 RFC Form
                // 360002049531 Sandbox
                if (ticketForm['ticket.form'].id == 360001185291) {
                    // 360038929832 RFC Module
                    // 1900000085527 sandbox
                    const moduleField = await client.get('ticket.customField:custom_field_360038929832')
                    const fieldData = moduleField['ticket.customField:custom_field_360038929832']

                    const summaryField = await client.get('ticket.customField:custom_field_360041749471')
                    const summaryData = summaryField['ticket.customField:custom_field_360041749471']

                    if (fieldData.includes('macromatix') && (summaryData == null || summaryData == '' || summaryData == '** This field is auto-populated **')) {
                        // Save Comment Data to Fields
                        const commentData = await client.get('ticket.comment')
                        const comment = commentData['ticket.comment'].text

                        const temp = document.createElement('div')

                        let commentText = comment.replace(/<p>&nbsp;<\/p>/g, '\n\n')
                        commentText = commentText.replace(/<\/p><p>/g, '<\/p>\n\n<p>')
                        commentText = commentText.replace(/<br>/g, '\n')

                        console.log(commentText)

                        temp.innerHTML = commentText

                        // 360041749471 Description
                        // 360045478731 sandbox
                        await client.set('ticket.customField:custom_field_360041749471', temp.innerText)
                    }

                    // return Promise.reject(false)
                    return Promise.resolve()
                }
            }

            // return Promise.reject(false)
            return Promise.resolve()
        })
    })
}

const fieldData = [{
    subject: '[Customer Name] - Staging - [Build Number]',
    description: '** This field is auto-populated **',
    implementation: 'Site Deployments Guide: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658445555/Site+Deployments+Guide',
    rollback: 'If the Database deploy fails it automatically rolled back. Currently there is no rollback option for deploys once the Database is successfully deployed and any issues found after this point must be patched forward.',
    qa: 'Pre/Post - Smoke Test: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658447855/Pre+Post+-+Smoke+Test'
}, {
    subject: '[Customer Name] - Prod - [Build Number]',
    description: '** This field is auto-populated **',
    implementation: 'Site Deployments Guide: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658445555/Site+Deployments+Guide',
    rollback: 'If the Database deploy fails it automatically rolled back. Currently there is no rollback option for deploys once the Database is successfully deployed and any issues found after this point must be patched forward.',
    qa: 'Pre/Post - Smoke Test: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658447855/Pre+Post+-+Smoke+Test'
}, {
    subject: 'MDCN - Staging - [Build Number]',
    description: '** This field is auto-populated **',
    implementation: 'Site Deployments Guide: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658445555/Site+Deployments+Guide',
    rollback: 'If the Database deploy fails it automatically rolled back. Currently there is no rollback option for deploys once the Database is successfully deployed and any issues found after this point must be patched forward.',
    qa: 'Pre/Post - Smoke Test: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658447855/Pre+Post+-+Smoke+Test'
}, {
    subject: 'MDCN - Prod - [Build Number]',
    description: '** This field is auto-populated **',
    implementation: 'Site Deployments Guide: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658445555/Site+Deployments+Guide',
    rollback: 'If the Database deploy fails it automatically rolled back. Currently there is no rollback option for deploys once the Database is successfully deployed and any issues found after this point must be patched forward.',
    qa: 'Pre/Post - Smoke Test: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658447855/Pre+Post+-+Smoke+Test'
}, {
    subject: 'CFA - Staging - [Build Number]',
    description: '** This field is auto-populated **',
    implementation: 'CFA Release Process: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/3572531504/CFA+Release+Process',
    rollback: 'CFA Release Process: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/3572531504/CFA+Release+Process',
    qa: 'CFA Release Process: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/3572531504/CFA+Release+Process'
}, {
    subject: 'CFA - Prod - [Build Number]',
    description: '** This field is auto-populated **',
    implementation: 'CFA Release Process: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/3572531504/CFA+Release+Process',
    rollback: 'CFA Release Process: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/3572531504/CFA+Release+Process',
    qa: 'CFA Release Process: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/3572531504/CFA+Release+Process'
}, {
    subject: 'Android native release',
    description: `Release for these branded apps:

which will include the following change:`,
    implementation: `Please follow Google Play Implementation SOP`,
    rollback: `Please follow Google Play Rollback SOP`,
    qa: `Executed tests - 
Passed tests - 
Failed tests - 

Known defects from previous releases:`
}, {
    subject: 'iOS native release',
    description: `Release for these branded apps:

which will include the following change:`,
    implementation: `Please follow Apple AppStore Implementation SOP`,
    rollback: `Please follow Apple Appstore Rollback SOP`,
    qa: `Total Test cases: 
Passed - 
Failed - 

Known defects from previous releases:`
}, {
    subject: 'Goods Receiving API X.X.XXX release',
    description: `Goods Receiving API`,
    implementation: `Deploy Goods Receiving API version XXX`,
    rollback: `Rollback Goods Receiving API version XXX using Octopus Deploy`,
    qa: `All integration tests passed successfully: 

    http://fourth-adaco-jenkins.cloudapp.net/view/Fourth%20P2P%20API/job/Fourth.GoodReceiving.Tests/  and  http://fourth-adaco-jenkins.cloudapp.net/view/Fourth%20P2P%20API/job/Fourth.GoodReceivingMessageBusIntegration.Tests/`
}, {
    subject: 'Inventory Service API X.X.XXX release',
    description: `Inventory Service API`,
    implementation: `Deploy Inventory Service API version XXX`,
    rollback: `Rollback Inventory Service API version XXX using Octopus Deploy`,
    qa: `All integration tests passed successfully: http://fourth-adaco-jenkins.cloudapp.net/view/Fourth%20P2P%20API/job/Fourth.InventoryServiceMessageBusIntegration.Tests/`
}, {
    subject: 'ESS UI - XX.X.X release',
    description: `Application upgrade of ESS UI for Live EMEA.

New features and enhancements:

Bugfixes:`,
    implementation: `1. LP for Hotels team to update the release comms for the upcoming ESS release

2. LP for Hotels team to deploy ESS app, build number XXX using Octopus Deploy

3. LP for Hotels QA will then commence post-implementation testing

4. LP for Hotels team to update the release comms once the new release has been successfully deployed and passed all production tests`,
    rollback: `LP for Hotels team to roll back to build XXX, using Octopus Deploy`,
    qa: `TCR is attached.`
}, {
    subject: 'PS Labour Live Scheduled Release Sprint x',
    description: `This is the standard delivery of work from the People System - Payroll team for Sprint X

Rally Milestone:

Release items:`,
    implementation: `Automated SQL deployment\n\nRun SQL deployment\nhttps://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-sql/deployments/releases/XXXX\n\nAutomated web deployment\nWeb components (DLLs, COM, Web, com wrapper orchestration)\nRun Octopus job PS - Web Components\nhttps://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-web-components/deployments/releases/XXX\n\nCORE API\nhttps://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-core-api-services/deployments/releases/XXX\n\nApp services\nhttps://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-app-services/deployments/releases/XXXX\n\nHang Fire API\nhttps://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-hangfire/deployments/releases/XXX`,
    rollback: `Web component WEB, COM, Fourth import service, Orchestration buffer use the following OD release line in order to rollback to previous version
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-web-components/deployments/releases/XXX

SQL - Use hot fix strategy

CORE API rollback to previous version
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-core-api-services/deployments/releases/XXX

App services
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-app-services/deployments/releases/XXX

Hang Fire API
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-hangfire/deployments/releases/XXX`,
    qa: `Regression tests executed on pre - live environment, as part of the Team’s standard procedures. 

TCR to be Attached. All failed tests passed manually.

Release to be smoke tested immediately after the deployment`
}, {
    subject: 'PS Payroll Scheduled Release Sprint x',
    description: `This is the standard delivery of work from the People System - Payroll team for Sprint X

Rally Milestone:

Release items:`,
    implementation: `Automated SQL deployment
Run SQL deployment
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-sql/deployments/releases/XXXX

Automated web deployment
Web components (DLLs, COM, Web, com wrapper orchestration)
Run Octopus job PS - Web Components
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-web-components/deployments/releases/XXX

CORE API
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-core-api-services/deployments/releases/XXX

App services
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-app-services/deployments/releases/XXXX

Hang Fire API
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-hangfire/deployments/releases/XXX`,
    rollback: `Web component WEB, COM, Fourth import service, Orchestration buffer use the following OD release line in order to rollback to previous version
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-web-components/deployments/releases/XXX

SQL - Use hot fix strategy

CORE API rollback to previous version
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-core-api-services/deployments/releases/XXX

App services
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-app-services/deployments/releases/XXX

Hang Fire API
https://prod-deploy.fourth.com/app#/Spaces-1/projects/ps-hangfire/deployments/releases/XXX`,
    qa: `Regression tests executed on pre - live environment, as part of the Team’s standard procedures. 

TCR to be Attached. All failed tests passed manually.

Release to be smoke tested immediately after the deployment`
}, {
    subject: 'Labour Productivity - XX.X.X release',
    description: `This is the standard delivery of work from Labour Productivity team for Sprint X

Rally Milestone:
    
Release items:`,
    implementation: `Deploy vXXX as per the https://fourthlimited.atlassian.net/wiki/spaces/TEAMHOURS/pages/86661488/How+to+create+a+scheduled+release\n\nand https://prod-deploy.fourth.com/app#/Spaces-1/projects/lp-hotels-api\n\nusing Octopus`,
    rollback: `Redeploy vXXX as per the Standard\n\nhttps://fourthlimited.atlassian.net/wiki/spaces/TEAMHOURS/pages/102694940/SOP+-+Rollback\n\nusing Octopus`,
    qa: `Tested as per the standard LP QA process\n\nhttps://fourthlimited.atlassian.net/wiki/spaces/TEAMHOURS/pages/102826013/SOP+-+Testing+Strategy\n\nhttps://fourthlimited.atlassian.net/wiki/spaces/TEAMHOURS/pages/2862350650/Release+Schedule+2021\n\nRelease to be smoke tested immediately after the release when data enrichment finishes.\n\nTCR to be circulated post release`
}, {
    subject: 'Labour Productivity Shift API - XX.X.X - Update to latest version of TH dependencies XX.XX.X',
    description: `Update for LP.Shifts API dependencies on TeamHours to version XXX

Please refer to RFCXXX for release items.`,
    implementation: `Deploy XXX LP.Shifts API only as per the Standard Labour Productivity deployment process using Octupus.`,
    rollback: `Deploy XXX LP.Shifts API only as per the Standard Labour Productivity deployment process using Octupus.`,
    qa: `Tested with TH release XXX

Automated LP.Shifts API tests passed
http://ci.teamhours.com:7542/view/Prelive%20Automation/job/ShiftsApi%20Integration%20Tests%20Prelive/`
}, {
    subject: 'Inventory Full Deployment [DATE]',
    description: `This is an Inventory scheduled deployment which  will contain the following work items:

Rally Milestone:

Release items:`,
    implementation: `Standard Inventory deployment process using Octupus:

Background Job Runner: XXX

Inventory External Listener: XXX

Inventory Internal Listener: XXX

Inventory Web: XXX

Database: XXX`,
    rollback: `Redeploy as per Standard Inventory deployment process using Octupus:

Background Job Runner: XXX

Inventory External Listener: XXX

Inventory Internal Listener: XXX

Inventory Web: XXX

Database: Fix forward`,
    qa: `TCR is attached`
}, {
    subject: 'Scheduled StarChef release [DATE]',
    description: `This is a Starchef (RME) scheduled deployment which  will contain the following work items:

Rally Milestone:

Release items:`,
    implementation: `Standard Starchef deployment process using Octupus:

StarChef.MenuApi -XXX

StarChef.Database -XXX

StarChef.ImportApi -XXX

StarChef.ImportData.Service - XXX

Starchef.Listener - XXX

Starchef.Msmq.Service - XXX

StarChef.net - XXX

StarChef.ReportEngine - XXX

Starchef.SqlQueue.Service - XXX

StarChef.SupplierImport - XXX

Starchef.WebAPIV1-V2 - XXX

Starchef.Tools.Starchef.Admin - XXX

Starchef.Light - XXX`,
    rollback: `Redeploy as per Standard Starchef deployment process using Octupus:

DB Migration cannot be rollbacked, only fix forward.

StarChef.MenuApi -XXX

StarChef.ImportApi -XXX

StarChef.ImportData.Service - XXX

Starchef.Listener - XXX

Starchef.Msmq.Service - XXX

StarChef.net - XXX

StarChef.ReportEngine - XXX

Starchef.SqlQueue.Service - XXX

StarChef.SupplierImport - XXX

Starchef.WebAPIV1-V2 - XXX

Starchef.Tools.Starchef.Admin - XXX

Starchef.Light - XXX`,
    qa: `TCR is attached`
}, {
    subject: 'Adaco X.X.XXX.XXX release',
    description: `This is the standard delivery of work from Adaco team for Sprints X

Rally Milestone:

Release items:`,
    implementation: `Adaco - Octopus deployment documented here:  

https://prod-deploy.fourth.com/app#/projects/adaco/overview

Build: XXX`,
    rollback: `Unable to roll back Adaco release. Roll forward only. See https://fourthlimited.atlassian.net/wiki/display/ADACO/SOP+-+Rollback for details`,
    qa: `Adaco testing strategy documented here: 

https://fourthlimited.atlassian.net/wiki/display/ADACO/SOP+-+Testing+Strategy
https://fourthlimited.atlassian.net/wiki/spaces/ADACO/pages/2793966652/Adaco+Releases+2021 

NOTE: some automated tests failed during execution but it was caused by environment issues. After re run of failed tests all tests passed.`
}, {
    subject: 'eParts Dev Deployment [DATE]',
    description: `This is the standard delivery of work from the TS Dev team for Sprint X

Rally Milestone:

Release items:`,
    implementation: `Deployed as per the standard eParts deployment process:
https://fourthlimited.atlassian.net/wiki/spaces/TT/pages/103547435/Release+Management `,
    rollback: `Rolled back as per the standard eParts rollback process:
https://fourthlimited.atlassian.net/wiki/display/TT/SOP+-+Rollback`,
    qa: `TCR is attached`
}, {
    subject: 'eParts ProjectsDeployment [DATE]',
    description: `This is the standard delivery of work from the TS Projects team:

Rally Milestone:

Release items:`,
    implementation: `Deployed as per the standard eParts deployment process:
https://fourthlimited.atlassian.net/wiki/spaces/TT/pages/103547435/Release+Management `,
    rollback: `Rolled back as per the standard eParts rollback process:
https://fourthlimited.atlassian.net/wiki/display/TT/SOP+-+Rollback`,
    qa: `Refer to https://fourthlimited.atlassian.net/wiki/spaces/TT/pages/103874652/SOP+-+Testing+Strategy 

Release to be smoke tested immediately after the release`
}, {
    subject: 'Scheduled Delivery for TradeSimple [DATE]',
    description: `This is a Scheduled Delivery for TradeSimple for Sprint X

Rally Milestone: 

Release items:`,
    implementation: `Delivered as per the standard delivery process:
https://fourthlimited.atlassian.net/wiki/spaces/TT/pages/112722302/Hospitality+Implementation 
Core:XXX
Multibrowser Portal Deployment XXX
TS DB XXX
Mappers: XXX`,
    rollback: `Rolled back as per the standard rollback process:
https://fourthlimited.atlassian.net/wiki/spaces/TT/pages/112722343/Hospitality+Rollback 
Multibrowser Portal Deployment: XXX
TS DB :1.XXX
Mappers: XXX`,
    qa: `TCR is attached`
}, {
    subject: 'FnB Dev Deployment [DATE]',
    description: `This is a Scheduled Delivery for FnB for Sprint X

Release items:`,
    implementation: `Deployed as per the standard FnB Live deployment process after backup detailed here: https://fourthlimited.atlassian.net/wiki/display/FCT/SOP+-+Implementation`,
    rollback: `Rolled back as per the standard FnB Live deployment process. Restore from backup. https://fourthlimited.atlassian.net/wiki/display/FCT/SOP+-+Rollback`,
    qa: `Tested as part of the FnB Live Support Team’s standard procedures. SOP Testing Strategy 
The release will be smoke tested immediately after deployment is complete.`
}, {
    subject: 'ATS application updates - X.X.XXXX - Multi Tenanted clients',
    description: `This is a Scheduled Delivery for ATS for Sprint X

Release items:`,
    implementation: `Deployment is automated by Octopus https://prod-deploy.fourth.com/app#/projects/ats-deploy/overview`,
    rollback: `Roll back to previous stable release -XXX`,
    qa: `Test strategy: https://fourthlimited.atlassian.net/wiki/spaces/ATS/pages/1018135201/ATS+Test+Strategy 

Testing notes: https://fourthlimited.atlassian.net/wiki/spaces/ATS/pages/1414889686/Test+Closure+Reports `
}, {
    subject: 'Fourth Engage X.X release',
    description: `This is an Engage release for the rollout of:

Release items:`,
    implementation: `NA and APAC between 08:00 - 10:00 GMT - Deploy with Octopus. https://prod-deploy.fourth.com/app#/projects/fourthapp-web-deploy/overview
EMEA between 10:00 - 12:00 GMT - Deploy with Octopus. https://prod-deploy.fourth.com/app#/projects/fourthapp-web-deploy/overview`,
    rollback: `Re-Deploy previous build with Octopus. XXX`,
    qa: `Total passed manual:  
Total failed manual:

Total passed automated: 
Total failed automated: 

E2E tests have been executed:
Link to all existing known defects: 

https://rally1.rallydev.com/#/161958130680d/detail/userstory/203681115904`
}, {
    subject: 'Salesforce X.X release',
    description: `This is a Salesforce release for the rollout of:

Release items:`,
    implementation: `Please add implementation steps here:`,
    rollback: `Please add rollback steps here:`,
    qa: `TCR is attached`
}, {
    subject: 'Scheduled Menu Cycles UI release [DATE]',
    description: `This is a Menu Cycles UI release for the rollout of:

Release items:

Rally Milestone:`,
    implementation: `Execute Octopus Release XXX`,
    rollback: `Execute Octopus Release XXX`,
    qa: `TCR is attached`
}, {
    subject: 'Scheduled Menu Service API release [DATE]',
    description: `This is a Scheduled Delivery for Menu Service for Sprint X

Release items:

Rally Milestone:`,
    implementation: `Run MenuService Octopus Deploy job for release XXX`,
    rollback: `Run MenuService Octopus Deploy job for release XXX`,
    qa: `TCR is attached.`
}, {
    subject: 'Labour Productivity for Hotels - XX.X.X release',
    description: `Regular deployment of LP for Hotels to Live US, Live EMEA 

Release items:
    
Rally Milestone:`,
    implementation: `1. LP for Hotels team to update the release comms for the upcoming release

2. LP for Hotels team to deploy LP For Hotels app, build number XXX using https://prod-deploy.fourth.com/app#/Spaces-1/projects/lp-spaapps-ui/deployments
    
3. LP for Hotels QA will then commence post-implementation testing
    
4. LP for Hotels team to update the release comms once the new build has been successfully deployed and passed all production tests`,
    rollback: `Run LP for Hotels Octopus Deploy job for release XXX`,
    qa: `TCR is attached.`
}, {
    subject: 'My Schedule UI - XX.X.X release',
    description: `Application upgrade of MySchedules UI for Live EMEA, Live NA, Live APAC. 

New features and enhancements:

Bugfixes:`,
    implementation: `1. LP for Hotels team to update the release comms for the upcoming hotfix of My Schedule

2. LP for Hotels team to deploy My Schedules app, build number XXX using https://prod-deploy.fourth.com/app#/projects/my-schedule

3. LP for Hotels QA will then commence post-implementation testing

4. LP for Hotels team to update the release comms once the new hotfix has been successfully deployed and passed all production tests`,
    rollback: `LP for Hotels team to roll back to build XXX, using https://prod-deploy.fourth.com/app#/projects/my-schedule`,
    qa: `TCR is attached.`
}, {
    subject: 'Scheduled Delivery for Mobile UI - Receiving [DATE]',
    description: `Deployment of latest version of Mobile UI - XXX - Receiving to EMEA Prod and US Prod

Release items:

Rally Milestone:`,
    implementation: `Deploy new Mobile UI - Receiving build XXX using Octopus to both EMEA and US instances. Release version XXX`,
    rollback: `Redeploy Mobile UI - Receiving build XXX`,
    qa: `TCR is attached.`
}, {
    subject: 'Scheduled Delivery for Mobile UI - Ordering [DATE]',
    description: `Deployment of latest version of Mobile UI - XXX - Receiving to EMEA Prod and US Prod

Release items:

Rally Milestone:`,
    implementation: `Deploy new Mobile UI - Ordering build XXX using Octopus to both EMEA and US instances. Release version XXX`,
    rollback: `Redeploy Mobile UI - Ordering build XXX`,
    qa: `TCR is attached.`
}, {
    subject: 'Shift Management API - XX.X.X release',
    description: `Deployment of latest version of Shift Management API

Release items:`,
    implementation: `Deploy using octopus deploy https://prod-deploy.fourth.com/app#/projects/shift-management-api/releases`,
    rollback: `Redeploy using octopus deploy https://prod-deploy.fourth.com/app#/projects/shift-management-api/releases`,
    qa: `TCR is attached.`
}, {
    subject: 'Schedule Gateway API - XX.X.X release',
    description: `Deployment of latest version of Schedule Gateway API

Release items:`,
    implementation: `Deploy new Schedule Gateway API build XXX using Octopus 

Release version XXX`,
    rollback: `Redeploy Schedule Gateway API build XXX`,
    qa: `TCR is attached.`
}, {
    subject: 'EPOS Gateway X.X release',
    description: `Deployment of latest version of EPOS

Release items:`,
    implementation: `Release branch :releaseXXX
Deploy as per the standard Epos Gateway deployment procedure: Epos Gateway  SOP Implementation

Octopus project : https://prod-deploy.fourth.com/app#/projects/platform-epos-gateway/overview
Jenkins job : https://pds-jenkins.fourth.com/job/Epos-Pipeline/`,
    rollback: `Rollback build number: XXX
Rollback as per the standard Epos Gateway rollback procedure: Epos Gateway SOP Rollback`,
    qa: `Refer to the Rally user stories for QA information for each release item.
Testing to be applied:
    
1. Regression and Integration on QAi environments - https://pds-jenkins.fourth.com/view/Nightly-Runs/job/Fourth.Platform.EposGateway.IntegrationTests/

2. E2E testing with MC team - https://rally1.rallydev.com/#/23566979320/testfolders?detail=%2Ftestcase%2F483861274344%2Fresults

3. Smoke and Integration testing on Live environment immediately after the release`
}, {
    subject: 'Fourth Account Service X.X release',
    description: `Deployment of latest version of FAS

Release items:`,
    implementation: `Release Branch - releaseXXX
Deploy as per the standard Fourth Account Service deployment procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/114524916/Fourth+Account+Service+-+SOP+Implementation `,
    rollback: `Rollback as per the standard Fourth Account Service rollback procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/114721521/Fourth+Account+Service+-+SOP+Rollback   
Rollback build - XXX`,
    qa: `https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/338330241/SSO+Testing+Strategy 
Refer to the Rally user stories for QA information for each release item. 
Testing to be applied:

1. Regression,Integration and Load testing on QAi and Prelive environments;

2. Smoke and Integration testing on Live environment immediately after the release.`
}, {
    subject: 'Notification Service X.X release',
    description: `Deployment of latest version of Notification Service

Release items:`,
    implementation: `Release branch : releaseXXX
Deploy as per the standard Notification Service deployment procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/289833067/Notification+Service+-+SOP+Implementation`,
    rollback: `Release  rollback build : XXX
Rollback as per the standard Notification Service rollback procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/289734708/Notification+Service+-+SOP+Rollback `,
    qa: `https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/338199253/Notification+Service+Test+Strategy 
Refer to the Rally user stories for QA information for each release item. 
Testing to be applied:

1. Regression and Integration on QAi environments;

2. Smoke and Integration testing on Live environment immediately after the release.`
}, {
    subject: 'Analytics Hub - XX.X.X release',
    description: `Deployment of latest version of Analytics Hub

Release items:`,
    implementation: `Automated via octopus
https://prod-deploy.fourth.com/app#/Spaces-1/projects/analytics-hub/deployments/releases/`,
    rollback: `Re-deploy previous version
https://prod-deploy.fourth.com/app#/Spaces-1/projects/analytics-hub/deployments/releases/`,
    qa: `All automated tests passed on Azure devops`
}, {
    subject: 'Product Catalogue API X.X.XXX release',
    description: `Deployment of latest version of Product Catalogue API

Release items:`,
    implementation: `Deploy Product Catalogue version XXX using https://prod-deploy.fourth.com/app#/projects/product-catalogue/overview`,
    rollback: `Rollback Product Catalogue version XXX using Octopus Deploy`,
    qa: `All integration tests passed successfully: 
http://fourth-adaco-jenkins.cloudapp.net/view/Fourth%20P2P%20API/job/Fourth.ProductCatalogueService.Tests/1190/
TCR is attached `
}, {
    subject: 'Patch Core API production platforms [non-downtime/downtime] - [DATE]',
    description: `The Core API platform will be patched via WSUS with the latest patches per the plan:

Patching of all DB and File servers are exempt per the patch plan.`,
    implementation: `1. Windows Updates will be approved for the Core API Servers in the WSUS Console

2. Log onto each server and remove all components from LB 

3. Bring up the windows update API

4. Click Check for Updates

5. Install all updates that come up

6. Restart server when prompted

7. Bring up the windows Update API and check for updates again

8. If there are updates then repeat above steps 

9. If no updates, add server back into load balancing then repeat all steps on the rest of the servers`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken.`,
    qa: `Patches have been installed on the pre-live environment of this platform and tested before applying to production. 
Post implementation verification will be done `
}, {
    subject: 'Patch Core UI production platforms [non-downtime/downtime] - [DATE]',
    description: `The Core UI platforms will be patched via WSUS in accordance to the patching plan:`,
    implementation: `1. Pre-Requisite: A snapshot of each webserver to be taken before this RFC is carried out.

2. Windows Updates will be approved for the Core UI Servers in the WSUS Console.

3. Log onto 4TH-MKTP-UI1 and remove all of its components from Load Balancer. 

4. Bring up the windows update API

5. Click Check for Updates.

6. Install all updates that come up.

7. Restart server when prompted.

8. Repeat for all other servers`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken`,
    qa: `Patches have been installed on all prior environments and tested by the relevant devs teams`
}, {
    subject: 'Patch Core Utility production platforms [non-downtime/downtime] - [DATE]',
    description: `The Core Utility production servers will be patched from our WSUS instance in accordance to the February 2021 plan - 

https://fourthlimited.atlassian.net/wiki/spaces/IN/pages/2947711102/`,
    implementation: `1. Windows Updates will be approved for the Core Utility Servers in the WSUS Console.

2. Bring up the windows update API

3. Click Check for Updates.

4. Install all updates that come up.

5. Restart server when prompted.

6. Bring up the windows Update API and check for updates again.

7. If no updates, Repeat actions on next server.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken.`,
    qa: `Patches have previously been applied to platform with no issues.`
}, {
    subject: 'Patch Labour Productivity production platforms [non-downtime/downtime] - [DATE]',
    description: `The Labour Productivity production servers will be patched from our WSUS instance as per the February patch plan:`,
    implementation: `1. Windows Updates will be approved for the LP Servers in the WSUS Console.

2. Bring up the windows update API

3. Click Check for Updates.

4. Install all updates that come up.

5. Restart server when prompted.

6. Bring up the windows Update API and check for updates again.

7. If no updates, Repeat actions on next server.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken.`,
    qa: `Patches have been installed on the Ci-Dev/DevTest and UAT environments of this platform. These environments have been QA'd and no potential issues identified.`
}, {
    subject: 'Patch TradeSimple production platforms [non-downtime/downtime] - [DATE]',
    description: `The TradeSimple EMEA & NA non-downtime production servers will be patched from our WSUS instances as per the patch report detail on:

https://fourthlimited.atlassian.net/wiki/spaces/IN/pages/2626978406/`,
    implementation: `TS Platform

1. Windows Updates will be approved for the TS Servers in the WSUS Console.

2. Run the WindowsUpdate.ps1 OPS script designed to handle patching for the TS platform Tier by Tier.

The script will do the below:

1. Remove from LB (if required)

2. Stop Services (if required)

3. Install windows updates

4. Reboot

5. Start Services

6. to LB

All output is logged and must be checked at the end of each run.`,
    rollback: `Patches have been installed on the Dev, Projects, QA and QAI environments of this platform. These environments have been QA'd and no potential issues identified.`,
    qa: `Patches have been installed on the UAT and Dev environments of this platform. These environments have been QA'd and no potential issues identified.`
}, {
    subject: 'Patch People System production platforms [non-downtime/downtime] - [DATE]',
    description: `The People System and Billing production platforms (downtime) servers will be patched from our WSUS instance as per the patch report detail 

https://fourthlimited.atlassian.net/wiki/spaces/IN/pages/2833646588/`,
    implementation: `Pre-Requisite: A snapshot of each server to be taken before this RFC is carried out.

Windows Updates will be approved for the People System Servers in the WSUS Console.

1. Bring up the windows update API

2. Click Check for Updates.

3. Install all updates that come up.

4. Restart server when prompted.

5. Bring up the windows Update API and check for updates again.

6. If no updates, Repeat actions on next server.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken.`,
    qa: `Patches have been installed on the Dev, Projects, QA and QAI environments of this platform. These environments have been QA'd and no potential issues identified.
See attached for QA sign off from the team.`
}, {
    subject: 'Patch Fourth Connect production platforms [non-downtime/downtime] - [DATE]',
    description: `The Fourth Connect (Informatica) production servers will be patched from our WSUS instance as per the patch report detail :

https://fourthlimited.atlassian.net/wiki/spaces/IN/pages/2833646588/

Service will be interrupted during this window but total downtime should be low. UAE servers will be done in the EMEA window.`,
    implementation: `1. Windows Updates will be approved for the FC Servers in the WSUS Console.

2. Bring up the windows update API

3. Click Check for Updates.

4. Install all updates that come up.

5. Restart server when prompted.

6. Bring up the windows Update API and check for updates again.

7. If no updates, Repeat actions on next server.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken.`,
    qa: `Patches have been installed on the Ci-Dev/DevTest and UAT environments of this platform. These environments have been QA'd and no potential issues identified.`
}, {
    subject: 'Patch EPOS Gateway production platforms [non-downtime/downtime] - [DATE]',
    description: `The Epos Gateway production (downtime) servers will be patched from our WSUS instance as per the patch report detail - 

https://fourthlimited.atlassian.net/wiki/spaces/IN/pages/2833646588/`,
    implementation: `Windows Updates will be approved for the Epos Gateway Servers in the WSUS Console.

1. Bring up the windows update API

2. Click Check for Updates.

3. Install all updates that come up.

4. Restart server when prompted.

5. Bring up the windows Update API and check for updates again.

6. If no updates, Repeat actions on next server.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs.`,
    qa: `TCR is attached`
}, {
    subject: 'Patch TradeSimple eParts production platforms [non-downtime/downtime] - [DATE]',
    description: `The TradeSimple eParts production (downtime) servers will be patched from our WSUS instance as per the patch report detail - 

    https://fourthlimited.atlassian.net/wiki/spaces/IN/pages/2833646588/`,
    implementation: `Windows Updates will be approved for the Eparts Servers in the WSUS Console.

1. Bring up the windows update API

2. Click Check for Updates.

3. Install all updates that come up.

4. Restart server when prompted.

5. Bring up the windows Update API and check for updates again.

6. If no updates, Repeat actions on next server.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken`,
    qa: `Patches have been installed on the Ci-Dev and Projects environments of this platform. These environments have been QA'd and no potential issues identified.`
}, {
    subject: 'Patch FnB production platforms [non-downtime/downtime] - [DATE]',
    description: `The FnB Live production servers will be patched from our WSUS instance`,
    implementation: `Windows Updates will be approved for the FnB Servers in the WSUS Console.

1. Bring up the windows update API

2. Click Check for Updates.

3. Install all updates that come up.

4. Restart server when prompted.

5. Bring up the windows Update API and check for updates again.

6. If no updates, Repeat actions on next server.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken.`,
    qa: `Patches have been installed on the Pre-live environment of this platform. This environment has been QA'd and no potential issues identified.`
}, {
    subject: 'Patch Starchef production platforms [non-downtime/downtime] - [DATE]',
    description: `The StarChef production servers will be patched from our WSUS instance as per the patch report detail -

https://fourthlimited.atlassian.net/wiki/spaces/IN/pages/2833646588/`,
    implementation: `Windows Updates will be approved for the StarChef Servers in the WSUS Console.

1. Bring up the windows update API

2. Click Check for Updates.

3. Install all updates that come up.

4. Restart server when prompted.

5. Bring up the windows Update API and check for updates again.

6. If no updates, Repeat actions on next server.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken. `,
    qa: `Patches have been installed on the Ci-Dev/DevTest and UAT environments of this platform. These environments have been QA'd and no potential issues identified.`
}, {
    subject: 'Patch R9 production platforms [non-downtime/downtime] - [DATE]',
    description: `The R9 production servers will be patched from our WSUS instance as per the patch plan:

https://fourthlimited.atlassian.net/wiki/spaces/IN/pages/2436628539/`,
    implementation: `Windows Updates will be approved for the R9 Servers in the WSUS Console.
Bring up the windows update API
Click Check for Updates.
Install all updates that come up.
Restart server when prompted.
Bring up the windows Update API and check for updates again.
If no updates, Repeat actions on next server.
Bring up the windows Update API and check for updates again.If no updates, Repeat actions on next server.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs`,
    qa: `UAT/Prelive instances of this platform were patched with no issues discovered.`
}, {
    subject: 'Patch Core T&A NA Live platform [non-downtime/downtime] - [DATE]',
    description: `The Core T&A production servers will be patched from our WSUS instance in accordance - 

https://fourthlimited.atlassian.net/wiki/spaces/IN/pages/2436628539/`,
    implementation: `1. Windows Updates will be approved for the Core Utility Servers in the WSUS Console.

2. Bring up the windows update API

3. Click Check for Updates.

4. Install all updates that come up.

5. Restart server when prompted.

6. Bring up the windows Update API and check for updates again.

7. If no updates, Repeat actions on next server.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken. `,
    qa: `Patches have previously been applied to platform with no issues.`
}, {
    subject: 'Patch Adaco production platforms [non-downtime/downtime] - [DATE]',
    description: `The Adaco production (non-downtime and downtime) servers will be patched from our WSUS instances as per the patch report detail 

https://fourthlimited.atlassian.net/wiki/spaces/IN/pages/2947711102/`,
    implementation: `Adaco Platform

1. Windows Updates will be approved for the Adaco Servers in the WSUS Console.

2. Run the WindowsUpdate.ps1 OPS script designed to handle patching for the Adaco platform Tier by Tier.

The script will do the below:

1. Remove from LB (if required)

2. Stop Services (if required)

3. Install windows updates

4. Reboot

5. Start Services

6.Add to LB

All output is logged and must be checked at the end of each run.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken.`,
    qa: `Patches have been installed on the UAT and Dev environments of this platform. These environments have been QA'd and no potential issues identified.`
}, {
    subject: 'Scheduled Delivery for Mobile UI - Counting[DATE]',
    description: `Deployment of latest version of Mobile UI - XXX - Counting to EMEA Prod and US Prod 

Release items:

Rally Milestone:`,
    implementation: `1. Deploy new Mobile UI - Counting build XXX using https://prod-deploy.fourth.com/app#/projects/stock-count/overview to both EMEA and US instances. Release version XXX

2. Mobile UI P2P&I QA will then begin post implementation testing`,
    rollback: `Redeploy Mobile UI - Counting build XXX using https://prod-deploy.fourth.com/app#/projects/stock-count/overview`,
    qa: `see attached TCR`
}, {
    subject: 'Media Service X.X release',
    description: `Deployment of latest version of Media service

Release items:

Rally Milestone:`,
    implementation: `Deploy as per the standard Media Service deployment procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/933429670/Media+Service+-+SOP+Implementation  `,
    rollback: `Rollback build:XXX
Rollback as per the standard Media Service rollback procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/931889566/Media+Service+-+SOP+Rollback `,
    qa: `Testing Strategy >https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/933364396/Media+Service+Test+Strategy 
Refer to the Rally user stories for QA information for each release item. 
Testing to be applied:

1. Regression and Integration testing on QAi and Prelive environments.

2. Smoke and Integration testing on Live environment immediately after the release.

3. End to end testing with Fourth App Team.`
}, {
    subject: 'Omnivore Connector X.X release',
    description: `Deployment of latest version of Omnivore Connector

Release items:

Rally Milestone:`,
    implementation: `Release Branch: xxx
Deploy as per the standard Omnivore deployment procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/1203667435/Omnivore+connector+-+SOP+Implementation `,
    rollback: `Rollback build:XXX
Rollback as per the standard Omnivore rollback procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/1207074875/Omnivore+connector+-+SOP+Rollback SOP Rollback`,
    qa: `https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/338330241/SSO+Testing+Strategy 
Refer to the Rally user stories for QA information for each release item.
Testing to be applied:

1. Regression and Integration on QAi and Prelive environments;

2. Smoke and Integration testing on Live environment immediately after the release.`
}, {
    subject: 'Organization Service X.X release',
    description: `Deployment of latest version of Organization Service

Release items:

Rally Milestone:`,
    implementation: `Release Branch: xxx
Deploy as per the standardOrganization Service deployment procedure`,
    rollback: `Rollback build:XXX
Rollback as per the standard Organization Service rollback procedure`,
    qa: `see attached TCR`
}, {
    subject: 'Task Service X.X release',
    description: `Deployment of latest version of Task Service

Release items:

Rally Milestone:`,
    implementation: `Release Branch: xxx
Deploy as per the standard Task Service deployment procedure`,
    rollback: `Rollback build:XXX
Rollback as per the standard Task Service rollback procedure`,
    qa: `Testing Strategy > SOP - Testing Strategy: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/338297561/FeedService+Test+Strategy 
Refer to the Rally user stories for QA information for each release item.
Testing to be applied:

1. Regression,Integration and Load testing on QAi and Prelive environments;

2. Smoke and Integration testing on Live environment immediately after the release.`
}, {
    subject: 'Web Hook Service X.X release',
    description: `Deployment of latest version of Web Hook Service

Release items:

Rally Milestone:`,
    implementation: `Release Branch: xxx
Deploy as per the standard Web Hook service deployment procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/1612185768/WebHook+Service+-+SOP+Implementation `,
    rollback: `Rollback build:xxx
Rollback as per the standard Web Hook service rollback procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/1612284085/WebHook+Service+-+SOP+Rollback `,
    qa: `Testing Strategy >https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/1612251289/WebhookSerivce+Test+Strategy 

Testing to be applied:

1. Regression & Integration on QAi  environment; - Automatically tested with 

https://pds-jenkins.fourth.com/view/Nightly-Runs/job/Fourth.Platform.WebHookService-IntegrationTestsNightly/

1. Smoke and Integration testing on Live environment immediately after the release.`
}, {
    subject: 'User Impersonation API X.X release',
    description: `Deployment of latest version of User Impersonation UI

Release items:

Rally Milestone:`,
    implementation: `Release branch : xxx
Deploy as per the standard deployment procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/2551447735/User+Impersonation+UI+-+SOP+Implementation 
https://prod-deploy.fourth.com/app#/Spaces-1/projects/fourth-platform-userimpersonation-ui/deployments`,
    rollback: `Rollback build:xxx
Rollback as per the standard User Impersonation UI rollback procedure`,
    qa: `Refer to the Rally user stories for QA information for each release item. 
Testing to be applied:
    
1. Regression and Integration testing on QAi and Prelive environments.
    
2. Smoke and Integration testing on Live environment immediately after the release.`
}, {
    subject: 'Fourth Analytics Gateway X.X release',
    description: `Deployment of latest version of Fourth Analytics Gateway

Release items:

Rally Milestone:`,
    implementation: `Release Branch: xxx
Deploy as per the standard Fourth Analytics deployment procedure: Fourth Analytics- SOP Implementation`,
    rollback: `Rollback build:  xxx
Rollback as per the standard Fourth Analytics rollback procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/114754195/FourthAnalytics 
Database rollback: Use Restore functionality from Azure portal and restore to the latest database backup.`,
    qa: `Testing to be applied:

1. Regression and Integration on QAi and Prelive environment;

2. Smoke and Integration testing on Live environments immediately after the release.`
}, {
    subject: 'FAS UI X.X release',
    description: `Deployment of latest version of FAS UI

Release items:

Rally Milestone:`,
    implementation: `Release branch: xxx
Deploy as per the standard FAS WebApp deployment procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/114656009/FAS+Admin+WebApp+-+SOP+Implementation `,
    rollback: `Rollback build:xxx
Rollback as per the standard FAS WebApp rollback procedure: https://fourthlimited.atlassian.net/wiki/spaces/PT/pages/114492263/FAS+Admin+WebApp+-+SOP+Rollback`,
    qa: `Refer to the Rally user stories for QA information for each release item. 
Testing to be applied:
    
1. Manual tests

2. Smoke and Integration testing on Live environment immediately after the release.`
}, {
    subject: 'Employment Management Service - XX.X.X release',
    description: `Deployment of latest version of Employment Management Service

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `Unit, integration and automated regression tests run against QAI`
}, {
    subject: 'Payroll Feed Service Admin - XX.X.X release',
    description: `Deployment of latest version of Payroll Feed Service Admin

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'Payroll Feed Service API - XX.X.X release',
    description: `Deployment of latest version of Payroll Feed Service API

Release items:`,
    implementation: `After verification of Live-Us-Test deployment proceed to LIVE-US
Deploy using Octopus -xxx`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'Gross Wage Engine - XX.X.X release',
    description: `Deployment of latest version of Gross Wage Engine

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'HR Gateway API - XX.X.X release',
    description: `Deployment of latest version of HR Gateway API

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'HR Data Importer UI - XX.X.X release',
    description: `Deployment of latest version of HR Data Importer UI

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'HR Data Importer API - XX.X.X release',
    description: `Deployment of latest version of HR Data Importer API

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'Rules Admin UI - XX.X.X release',
    description: `Deployment of latest version of Rules Admin UI

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'Rules Admin API - XX.X.X release',
    description: `Deployment of latest version of Rules Admin API

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'PrismHR API Integrator - XX.X.X release',
    description: `Deployment of latest version of PrismHR API Integrator

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'PrismHR SSO - XX.X.X release',
    description: `Deployment of latest version of PrismHR SSO 

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'Predictive Scheduling Service - XX.X.X release',
    description: `Deployment of latest version of Predictive Scheduling Service 

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'ESS UI - XX.X.X release',
    description: `Application upgrade of ESS UI for Live EMEA.

New features and enhancements:

Bugfixes:`,
    implementation: `1. LP for Hotels team to update the release comms for the upcoming ESS release

2. LP for Hotels team to deploy ESS app, build number XXX using Octopus Deploy 

3. LP for Hotels QA will then commence post-implementation testing

4. LP for Hotels team to update the release comms once the new release has been successfully deployed and passed all production tests`,
    rollback: `LP for Hotels team to roll back to build XXX, using Octopus Deploy `,
    qa: `TCR is attached`
}, {
    subject: 'Patch Fourth Connect production platforms [non-downtime/downtime] - [DATE]',
    description: `The Fourth Connect (Informatica) production servers will be patched from our WSUS instance as per the patch report detail on 2021 patch plan:

February '21 Patch Plan: https://fourthlimited.atlassian.net/wiki/spaces/IN/pages/2947711102

Service will be interrupted during this window but total downtime should be low. UAE servers will be done from 14:00-15:30 with non-downtime and downtime occurring within the same window.`,
    implementation: `1. Windows Updates will be approved for the FC Servers in the WSUS Console.

2. Bring up the windows update API

3. Click Check for Updates.

4. Install all updates that come up.

5. Restart server when prompted.

6. Bring up the windows Update API and check for updates again.

7. If no updates, Repeat actions on next server.`,
    rollback: `Each update installed on the server can be removed individually via Add or Remove Programs. However If all the updates need to be rolled back then we can roll back to the precautionary snapshot of the server taken. `,
    qa: `Patches have been installed on the PreLive environments of this platform. This environments have been QA'd and no potential issues identified.`
}, {
    subject: 'Inventory Service API X.X.XXX release',
    description: `Inventory Service API`,
    implementation: `Deploy Inventory Service API version XXX`,
    rollback: `Rollback Inventory Service API version XXX using Octopus Deploy`,
    qa: `All integration tests passed successfully: http://fourth-adaco-jenkins.cloudapp.net/view/Fourth%20P2P%20API/job/Fourth.InventoryServiceMessageBusIntegration.Tests/`
}, {
    subject: 'Goods Receiving API X.X.XXX release',
    description: `Inventory Service API`,
    implementation: `Deploy Goods Receiving API version XXX`,
    rollback: `Rollback Goods Receiving API version XXX using Octopus Deploy`,
    qa: `All integration tests passed successfully: http://fourth-adaco-jenkins.cloudapp.net/view/Fourth%20P2P%20API/job/Fourth.GoodReceiving.Tests/  and  http://fourth-adaco-jenkins.cloudapp.net/view/Fourth%20P2P%20API/job/Fourth.GoodReceivingMessageBusIntegration.Tests/`
}, {
    subject: 'Labour Productivity for Hotels - XX.X.X release',
    description: `Regular deployment of LP for Hotels to Live US, Live EMEA 

Release items:

Rally Milestone:`,
    implementation: `1. LP for Hotels team to update the release comms for the upcoming release

2. LP for Hotels team to deploy LP For Hotels app, build number XXX using Octopus Deploy

3. LP for Hotels QA will then commence post-implementation testing

4. LP for Hotels team to update the release comms once the new build has been successfully deployed and passed all production tests`,
    rollback: `Run LP for Hotels Octopus Deploy job for release XXX`,
    qa: `TCR is attached`
}, {
    subject: 'Labour Productivity - XX.X.X release',
    description: `This is the standard delivery of work from Labour Productivity team for Sprint X

Rally Milestone:

Release items:`,
    implementation: `Deploy vXXX as per the

How to create a scheduled release: https://fourthlimited.atlassian.net/wiki/spaces/TEAMHOURS/pages/86661488

using Octopus and deploy LP For Hotels app, build number xxx using https://prod-deploy.fourth.com/app#/Spaces-1/projects/lp-hotels-api
`,
    rollback: `Redeploy vXXX as per the Standard

SOP - Rollback: https://fourthlimited.atlassian.net/wiki/spaces/TEAMHOURS/pages/102694940 

using Octopus`,
    qa: `Tested as per the standard LP QA process

SOP - Testing Strategy: https://fourthlimited.atlassian.net/wiki/spaces/TEAMHOURS/pages/102826013

Release Schedule 2021: https://fourthlimited.atlassian.net/wiki/spaces/TEAMHOURS/pages/2862350650

Release to be smoke tested immediately after the release when data enrichment finishes.

TCR to be circulated post release`
}, {
    subject: 'Android native release',
    description: `Release for these branded apps:

which will include the following change:`,
    implementation: `Please follow Google Play Implementation SOP: https://fourthlimited.atlassian.net/wiki/spaces/FA/pages/112623815/Google+Play+Implementation`,
    rollback: `Please follow Google Play Rollback SOP: https://fourthlimited.atlassian.net/wiki/spaces/FA/pages/112722043/Apple+AppStore+Rollback`,
    qa: `Executed tests - 
Passed tests - 
Failed tests - 0

Known defects from previous releases:`
}, {
    subject: 'iOS native release',
    description: `Release for these branded apps:

which will include the following change:`,
    implementation: `Please follow Apple AppStore Implementation SOP: https://fourthlimited.atlassian.net/wiki/spaces/FA/pages/112722034/Apple+AppStore+Implementation`,
    rollback: `Please follow Apple Appstore Rollback SOP: https://fourthlimited.atlassian.net/wiki/spaces/FA/pages/112722043/Apple+AppStore+Rollback`,
    qa: `Total Test cases: 
Passed - 
Failed - 

Known defects from previous releases:`
}, {
    subject: 'Scheduled Delivery for Mobile UI - Transfer[DATE]',
    description: `Deployment of latest version of Mobile UI Transfer - XXX - to EMEA Prod and NA Prod

Release items:

Rally Milestone:`,
    implementation: `1. Deploy new Mobile UI Transfer build XXX using Octopus Deploy 
to both EMEA and US instances

2. Mobile UI P2P&I QA will then begin post implementation testing`,
    rollback: `Redeploy Mobile UI Transfer build XXX using Octopus Deploy `,
    qa: `see attached TCR`
}, {
    subject: 'Banking API - XX.X.X release',
    description: `Deployment of latest version of Banking service - XXX

Release items:

Rally Milestone:`,
    implementation: `Please follow Banking API Implementation SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3822944259/Banking+API+-+SOP+Implementation`,
    rollback: `Please follow Banking API Rollback SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3823435804/Banking+API+-+SOP+Rollback`,
    qa: `Tested as per the standard QA process:

SOP - Testing Strategy: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3823370262/Banking+APIs+-+SOP+Testing

Executed tests - 
Passed tests - 
Failed tests -`
}, {
    subject: 'Predictive Scheduling Service - XX.X.X release',
    description: `Deployment of latest version of Predictive Scheduling Service 

Release items:`,
    implementation: `Deploy version xxx using Octopus deploy:`,
    rollback: `Rollback build:xxx using Octopus`,
    qa: `see attached TCR`
}, {
    subject: 'Worker Profile Manager - XX.X.X release',
    description: `Deployment of latest version of Worker Profile Manager - XXX 

Release items:

Rally Milestone:`,
    implementation: `Please follow Worker Profile Manager Implementation SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3827761271/Worker+Profile+Manager+-+SOP+Implementation`,
    rollback: `Please follow Worker Profile Manager Rollback SOP:https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3827892320/Worker+Profile+Manager+-+SOP+Rollback`,
    qa: `Tested as per the standard QA process:

SOP - Testing Strategy: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3830218759/Worker+Profile+Manager+-+SOP+Testing

Executed tests - 
Passed tests - 
Failed tests - `
}, {
    subject: 'Notifications - XX.X.X release',
    description: `Deployment of latest version of Notifications - XXX 

Release items:

Rally Milestone:`,
    implementation: `Please follow Notifications Implementation SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3830153217/Notifications+-+SOP+Implementation`,
    rollback: `Please follow Notifications rollback plan: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3830317057/Notifications+-+SOP+Rollback`,
    qa: `Tested as per the standard QA process:

SOP - Testing Strategy: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3830153323/Notifications+-+SOP+Testing

Executed tests - 
Passed tests - 
Failed tests - `
}, {
    subject: 'Worker Agreement Manager - XX.X.X release',
    description: `Deployment of latest version of Worker Agreement Manager - XXX 

Release items:

Rally Milestone:`,
    implementation: `Please follow Worker Agreement Manager Implementation SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3830349825/Worker+Agreement+Manager`,
    rollback: `Please follow Worker Profile Manager Rollback SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3827892320/Worker+Profile+Manager+-+SOP+Rollback`,
    qa: `Tested as per the standard QA process:

SOP - Testing Strategy: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3830349932/Worker+Agreement+Manager+-+SOP+Testing

Executed tests - 
Passed tests - 
Failed tests - `
}, {
    subject: 'Zendesk Connector - XX.X.X release',
    description: `Deployment of latest version of Zendesk Connector - XXX 

Release items:

Rally Milestone:`,
    implementation: `Please follow Zendesk Connector Implementation SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3831431242/Zendesk+Connector+-+SOP+Implementation`,
    rollback: `Please follow Zendesk Connector Rollback SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3831824476/Zendesk+Connector+-+SOP+Rollback`,
    qa: `Tested as per the standard QA process:

SOP - Testing Strategy: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3831758885/Zendesk+Connector+-+SOP+Testing

Executed tests - 
Passed tests - 
Failed tests - `
}, {
    subject: 'Employees Adapter - XX.X.X release',
    description: `Deployment of latest version of Employees Adapter - XXX 

Release items: 

Rally Milestone:`,
    implementation: `Please follow Employees Adapter Implementation SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3831988235/Employees+Adapter+-+SOP+Implementation`,
    rollback: `Please follow  Employees Adapter Rollback SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3832184871/Employees+Adapter+-+SOP+Rollback`,
    qa: `Tested as per the standard QA process:

SOP - Testing Strategy: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3832643845/Employees+Adapter+-+SOP+Testing

Executed tests - 
Passed tests - 
Failed tests - `
}, {
    subject: 'Jobs Importer - XX.X.X release',
    description: `Deployment of latest version of Jobs Importer - XXX 

Release items:

Rally Milestone:`,
    implementation: `Please follow Jobs Importer Implementation SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3832381532/Jobs+Importer+-+SOP+Implementation`,
    rollback: `Please follow Jobs Importer Rollback SOP: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3831791687/Jobs+Importer+-+SOP+Rollback`,
    qa: `Tested as per the standard QA process:

SOP - Testing Strategy: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3832840443/Jobs+Importer+-+SOP+Testing

Executed tests - 
Passed tests - 
Failed tests - `
}, {
    subject: '[Customer Name] - Test - [Build Number]',
    description: '** This field is auto-populated **',
    implementation: 'Site Deployments Guide: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658445555/Site+Deployments+Guide',
    rollback: 'If the Database deploy fails it automatically rolled back. Currently there is no rollback option for deploys once the Database is successfully deployed and any issues found after this point must be patched forward.',
    qa: 'Pre/Post - Smoke Test: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658447855/Pre+Post+-+Smoke+Test'
}, {
    subject: 'MDCN - Test - [Build Number]',
    description: '** This field is auto-populated **',
    implementation: 'Site Deployments Guide: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658445555/Site+Deployments+Guide',
    rollback: 'If the Database deploy fails it automatically rolled back. Currently there is no rollback option for deploys once the Database is successfully deployed and any issues found after this point must be patched forward.',
    qa: 'Pre/Post - Smoke Test: https://fourthlimited.atlassian.net/wiki/spaces/RBCD/pages/1658447855/Pre+Post+-+Smoke+Test'
}, {
    subject: 'Admin UI - XX.X.X release',
    description: `Deployment of latest version of Admin UI - XXX 

Release items:

Rally Milestone:`,
    implementation: `Please follow Admin UI - SOP Implementation: https://fourthlimited.atlassian.net/wiki/spaces/FAT/pages/3945660435/Admin+UI+-+SOP+Implementation`,
    rollback: `Please follow Admin UI - SOP Rollback: https://fourthlimited.atlassian.net/wiki/spaces/FAT/pages/3944677417/Admin+UI+-+SOP+Rollback`,
    qa: `Tested as per the standard QA process:

Admin UI - SOP Testing: https://fourthlimited.atlassian.net/wiki/spaces/FAT/pages/3944645272/Admin+UI+-+SOP+Testing

Executed tests - 
Passed tests - 
Failed tests - `
}, {
    subject: 'Bank File Importer - XX.X.X release',
    description: `Deployment of latest version of Bank File Importer - XXX 

    Release items:
    
    Rally Milestone:`,
    implementation: 'Please follow  Bank File Importer - SOP Implementation: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3976167695/Bank+File+Importer+-+SOP+Implementation',
    rollback: 'Please follow  Bank File Importer - SOP Rollback: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3976135570/Bank+File+Importer+-+SOP+Rollback',
    qa: `Tested as per the standard QA process: Bank File Importer - SOP Testing: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/3976135584/Bank+File+Importer+-+SOP+Testing 

    Executed tests - 
    Passed tests - 
    Failed tests -`
}, {
    subject: 'Cash Deposit Locations - XX.X.X release',
    description: `Deployment of latest version of Cash Deposit Locations - XXX 

    Release items:
    
    Rally Milestone:`,
    implementation: 'Please follow Cash Deposit Locations API - SOP Implementation: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/4038918202/Cash+Deposit+Locations+API+-+SOP+Implementation',
    rollback: 'Please follow Cash Deposit Locations API - SOP Rollback: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/4039245825/Cash+Deposit+Locations+API+-+SOP+Rollback',
    qa: `Tested as per the standard QA process: Cash Deposit Locations - SOP Testing: https://fourthlimited.atlassian.net/wiki/spaces/BankingAPI/pages/4039245839/Cash+Deposit+Locations+-+SOP+Testing 

    Executed tests - 
    Passed tests - 
    Failed tests -`
}]