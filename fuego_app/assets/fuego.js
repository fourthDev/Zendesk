let client

window.onload = () => {
    // Initialize the App
    client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '300px' });

    client.on('ticket.custom_field_360010489572.changed', async (e) => {
        // When the Sharpen Ring Group Queue is populated, check for EWA English
        // 360010489572 Sharpen Ring Group Queue
        // 1900000085707 sandbox
        const SharpenField = await client.get('ticket.customField:custom_field_360010489572')
		const fieldData = SharpenField['ticket.customField:custom_field_360010489572']

            if (fieldData.includes('EWA')) {
                // add the Fuego tag
				client.invoke('ticket.tags.add','fuego')
				// set the Fuego brand
				// 1900000286107 sandbox
				// 360007137671 production
				client.set('ticket.brand', 360007137671)
				// set the Fuego Worker agent group
				// 360021683732 sandbox
				// 4420564145293 production
				client.set('ticket.assignee', {groupId: 4420564145293})
				// set the Fuego Module
				// 360045479291 sandbox
				// 360029223312 production
				client.set('ticket.customField:custom_field_360029223312','module_fuego')
				}
			// return Promise.reject(false)
            return Promise.resolve()
			}
		)}