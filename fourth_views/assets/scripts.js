let client, user, views, groups, filteredViews

window.onload = () => {
    // Initialize the App
    client = ZAFClient.init();
    client.invoke('resize', { width: '800px', height: '400px' });

    client.on('app.registered', async (e) => {
        try {
            // Get User, Groups, Views Data
            user = await client.get('currentUser')
            views = await getViewData()
            groups = await getGroupData(user.currentUser.id, user.currentUser.role === 'admin' ? true : false)

            // Filter Views Data for Current User into Groups
            filteredViews = await filterViews(views, groups)
            
            // Add Event Listeners for App Navigation
            const folders = document.querySelectorAll('.folder')
            folders.forEach(folder => {
                folder.addEventListener('click', e => {
                    e.preventDefault()
                    
                    folders.forEach(folder => folder.className = 'folder')
                    e.target.classList.add('folder-selected')

                    if (e.target.innerText === 'Personal Views') {
                        displayViews(filteredViews[0])
                    } else if (e.target.innerText === 'Groups Views') {
                        displayViews(filteredViews[2], true)
                    } else if (e.target.innerText === 'Global Views') {
                        displayViews(filteredViews[1])
                    }
                })
            })

            displayViews(filteredViews[0])

            // Reveal the App Container
            document.querySelector('#loading').style.display = 'none'
            document.querySelector('#app-container').style.display = 'flex'
        } catch(e) { console.info(e) }
    })
}

const displayViews = (views, isGroups) => {
    const viewsList = document.querySelector('#folder-views')
    viewsList.innerHTML = ''

    if (isGroups) {
        // Create the Groups List Container
        const groupsList = document.createElement('section')
        groupsList.id = 'groups-list'

        const groupViewsList = document.createElement('section')
        groupViewsList.id = 'group-views'

        viewsList.style.display = 'flex'

        let firstKey

        // Loop through views using object.keys
        Object.keys(views).forEach((view, index) => {
            const newGroup = document.createElement('div')
            newGroup.className = 'group'
            newGroup.innerText = view
            index == 0 ? newGroup.classList.add('group-selected') : null
            index == 0 ? firstKey = view : null

            groupsList.appendChild(newGroup)
        })

        // Append the Groups List Container to the Page
        viewsList.appendChild(groupsList)
        viewsList.appendChild(groupViewsList)

        // Get all the group folder things and add event listeners
        const groups = document.querySelectorAll('.group')

        groups.forEach(group => {
            group.addEventListener('click', e => {
                e.preventDefault()

                groups.forEach(group => group.className = 'group')
                e.target.classList.add('group-selected')

                displayGroupViews(filteredViews[2], group.innerText)
            })
        })

        displayGroupViews(filteredViews[2], firstKey)
    } else {
        viewsList.style.display = 'block'
        // Loop through views as array
        views.forEach(view => {
            const newView = document.createElement('div')
            newView.className = 'view'
            newView.innerText = view.title

            newView.addEventListener('click', e => { client.invoke('routeTo', 'views', view.id) })

            viewsList.appendChild(newView)
        })
    }
}

const displayGroupViews = (views, key) => {
    const viewsList = document.querySelector('#group-views')
    viewsList.innerHTML = ''

    views[key].forEach(view => {
        const newView = document.createElement('div')
        newView.className = 'view'
        newView.innerText = view.title

        newView.addEventListener('click', e => { client.invoke('routeTo', 'views', view.id) })

        viewsList.appendChild(newView)
    })
}

const filterViews = (views, groups) => {
    return new Promise((resolve, reject) => {
        try {
            const sharedViews = []
            const personalViews = []
            const groupViews = {}
    
            views.forEach(view => {
                if (view.restriction) {
                    if (view.restriction.type === 'Group') {
                        view.restriction.ids.forEach(id => {
                            let group = groups.filter(group => group.id === id)
                            
                            if (group.length >= 1) {
                                const name = group[0].name

                                if (groupViews[name]) {
                                    groupViews[name].push(view)
                                } else {
                                    groupViews[name] = [view]
                                }
                            }
                        })
                    } else { personalViews.push(view) }
                } else { sharedViews.push(view) }
            })
    
            resolve([personalViews, sharedViews, groupViews])
        } catch(e) { console.info(e) }
    })
}

const getViewData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let views = []
            let requestURL = '/api/v2/views/active'
            
            while (requestURL) {
                const viewsData = await client.request({url: requestURL, type: 'GET', dataType: 'json'})

                views = views.concat(viewsData.views)

                requestURL = viewsData.next_page ? viewsData.next_page : null
            }

            resolve(views)
        } catch(e) { reject(e) }
    })
}

const getGroupData = (id, isAdmin) => {
    return new Promise(async (resolve, reject) => {
        try {
            let groups = []
            let requestURL = isAdmin ? '/api/v2/groups' : `/api/v2/users/${id}/groups`
            
            while (requestURL) {
                const groupsData = await client.request({url: requestURL, type: 'GET', dataType: 'json'})

                groups = groups.concat(groupsData.groups)

                requestURL = groupsData.next_page ? groupsData.next_page : null
            }

            resolve(groups)
        } catch(e) { reject(e) }
    })
}