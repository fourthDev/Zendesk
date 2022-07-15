let client

window.onload = () => {
    // Initialize the App
    client = ZAFClient.init();

    client.on('app.registered', async (e) => {
        // Determine what context the app is loaded in
        const appContext = await client.context()
        const appLocation = appContext.location

        // Get module and fuego issue when new
        const mod = await client.get('ticket.customField:custom_field_360029223312');
        const fuegoIssue = await client.get('ticket.customField:custom_field_360048176772');
        const category = await client.get('ticket.customField:custom_field_360029295891');
        const reason = await client.get('ticket.customField:custom_field_7358648952077');
        const issue = await client.get('ticket.customField:custom_field_7358641727757');
        const disposition = await client.get('ticket.customField:custom_field_7358684887693');
        let nullValues = ['-', '', null];

        // if module is Fuego && fuego issue is available
        if (mod['ticket.customField:custom_field_360029223312'] == 'module_fuego') {
            handleFuegoIssueEvent();
            if (fuegoIssue['ticket.customField:custom_field_360048176772'] !== null) {
                try {
                    // Show Category and Sub-Category dropdown
                    client.invoke({
                        'ticketFields:custom_field_360029295891.show': [],
                        'ticketFields:custom_field_360029295931.show': []
                    })
                } catch (err) { console.log(err); }
            }
        } else {
            // Hide Fuego Issue
            client.invoke('ticketFields:custom_field_360048176772.hide');
        }

        // Show and Hide RID codes depending on Category
        if (category['ticket.customField:custom_field_360029295891'] == 'integration') {
            try {
                if (!nullValues.includes(disposition['ticket.customField:custom_field_7358684887693']) &&
                    !nullValues.includes(reason['ticket.customField:custom_field_7358648952077']) &&
                    !nullValues.includes(issue['ticket.customField:custom_field_7358641727757'])) {

                    // only show Sub-Category if RID codes are filled out
                    client.invoke('ticketFields:custom_field_360029295931.show');
                } else {
                    client.set('ticket.customField:custom_field_360029295931', null);
                    client.invoke('ticketFields:custom_field_360029295931.hide');
                }
                // show RID codes
                client.invoke({
                    'ticketFields:custom_field_7358648952077.show': [],
                    'ticketFields:custom_field_7358641727757.show': [],
                    'ticketFields:custom_field_7358684887693.show': [],
                });

            } catch (e) {
                console.log(e);
            }
        } else {
            // clear and hide RID codes
            client.set({
                'ticket.customField:custom_field_7358648952077': null,
                'ticket.customField:custom_field_7358641727757': null,
                'ticket.customField:custom_field_7358684887693': null,
            });
            // hide RID codes
            client.invoke({
                'ticketFields:custom_field_7358648952077.hide': [],
                'ticketFields:custom_field_7358641727757.hide': [],
                'ticketFields:custom_field_7358684887693.hide': [],
            });
        }

        // When any value on the ticket is changed, handle it
        client.on('*.changed', async (e) => {
            const module = await client.get('ticket.customField:custom_field_360029223312')
            const mod = module['ticket.customField:custom_field_360029223312'];
            const cat = await client.get('ticket.customField:custom_field_360029295891');
            const reason = await client.get('ticket.customField:custom_field_7358648952077');
            const issue = await client.get('ticket.customField:custom_field_7358641727757');
            const disposition = await client.get('ticket.customField:custom_field_7358684887693');

            // if module is not Fuego
            if (mod !== 'module_fuego') {
                // Hide Fuego Issue Dropdown
                client.set('ticket.customField:custom_field_360048176772', null);
                client.invoke('ticketFields:custom_field_360048176772.hide');
            }

            if (cat['ticket.customField:custom_field_360029295891'] != 'integration') {
                // hide RID codes
                client.invoke({
                    'ticketFields:custom_field_7358648952077.hide': [],
                    'ticketFields:custom_field_7358641727757.hide': [],
                    'ticketFields:custom_field_7358684887693.hide': [],
                });
            }

            if (e.propertyName === 'ticket.custom_field_114103127511') { // Handle RBS Changes
                handleRBSEvent(e)
            } else if (e.propertyName === 'ticket.custom_field_360029223312') { // Handle Module Changes
                const fuegoIssue = await client.get('ticket.customField:custom_field_360048176772');
                const modAfterChange = await client.get('ticket.customField:custom_field_360029223312');

                const module = modAfterChange['ticket.customField:custom_field_360029223312'];
                const fuego = fuegoIssue['ticket.customField:custom_field_360048176772'];

                if (module == 'module_fuego' && fuego == null) {
                    handleFuegoIssueEvent();
                } else if (module == 'module_fuego' && fuego != null) {
                    try {
                        client.invoke({
                            'ticketFields:custom_field_360048176772.show': [], // Show Fuego Issue
                            'ticketFields:custom_field_360029295891.show': [], // Show Category
                            'ticketFields:custom_field_360029295931.show': [] // Show Sub-Category
                        })
                    } catch (err) { console.log(err); }
                } else {
                    client.invoke({
                        'ticketFields:custom_field_360048176772.hide': [], // Hide Fuego Issue
                        'ticketFields:custom_field_360029295891.show': [], // Show Category
                        'ticketFields:custom_field_360029295931.show': []  // Show sub-category
                    });
                }
                handleModuleEvent(e)
            } else if (e.propertyName === 'ticket.custom_field_360048176772') { // Handle Fuego Issue
                const getFuegoIssueValue = await client.get('ticket.customField:custom_field_360048176772');

                if (getFuegoIssueValue['ticket.customField:custom_field_360048176772'] == "") {
                    handleFuegoIssueEvent();
                } else {
                    // Handle Fuego Issue
                    try {
                        // Show Category and Sub-Category dropdown
                        client.invoke({
                            'ticketFields:custom_field_360029295891.show': [],
                            'ticketFields:custom_field_360029295931.show': []
                        })
                    } catch (err) { console.log(err); }
                }
            } else if (e.propertyName === 'ticket.custom_field_360029295891') { // Handle Categories
                
                // Show and Hide RID codes depending on Category                
                if (cat['ticket.customField:custom_field_360029295891'] == 'integration') {
                    // show RID codes
                    client.invoke({
                        'ticketFields:custom_field_7358648952077.show': [],
                        'ticketFields:custom_field_7358641727757.show': [],
                        'ticketFields:custom_field_7358684887693.show': [],
                    });

                    if (!nullValues.includes(disposition['ticket.customField:custom_field_7358684887693']) &&
                        !nullValues.includes(reason['ticket.customField:custom_field_7358648952077']) &&
                        !nullValues.includes(issue['ticket.customField:custom_field_7358641727757'])) {
                        // only show Sub-Category if RID codes are filled out
                        client.invoke('ticketFields:custom_field_360029295931.show');
                    } else {
                        client.set('ticket.customField:custom_field_360029295931', null);
                        client.invoke('ticketFields:custom_field_360029295931.hide');
                    }

                } else {
                    // clear and hide RID codes
                    client.set({
                        'ticket.customField:custom_field_7358648952077': null,
                        'ticket.customField:custom_field_7358641727757': null,
                        'ticket.customField:custom_field_7358684887693': null,
                    });
                    client.invoke({
                        'ticketFields:custom_field_7358648952077.hide': [],
                        'ticketFields:custom_field_7358641727757.hide': [],
                        'ticketFields:custom_field_7358684887693.hide': [],
                        'ticketFields:custom_field_360029295931.show': [] // show sub-Category if it was hidden
                    });
                    if (mod == 'module_fuego' && nullValues.includes(cat['ticket.customField:custom_field_360029295891'])) {
                        client.invoke('ticketFields:custom_field_360029295931.hide');
                    }

                }

                const module = await client.get('ticket.customField:custom_field_360029223312')

                if (module['ticket.customField:custom_field_360029223312'] == 'purchasing_and_inventory__adaco_') {
                    // Handle Adaco Category Changes
                    handleAdacoEvent(e)
                } else if (module['ticket.customField:custom_field_360029223312'] == 'macromatix') {
                    // Handle Macromatix Category Changes
                    handleMacromatixEvent(e)
                } else if (module['ticket.customField:custom_field_360029223312'] == 'module_fuego') {
                    // Handle EWA Category Changes
                    handleEWAEvent(e)
                } else {
                    // Handle Global Category Changes
                    handleCategoryEvent(e)
                }
            } else if (e.propertyName === 'ticket.custom_field_7358648952077' ||
                e.propertyName === 'ticket.custom_field_7358641727757' ||
                e.propertyName === 'ticket.custom_field_7358684887693') { // RID ticket fields

                if (cat['ticket.customField:custom_field_360029295891'] == 'integration') {
                    if (!nullValues.includes(disposition['ticket.customField:custom_field_7358684887693']) &&
                        !nullValues.includes(reason['ticket.customField:custom_field_7358648952077']) &&
                        !nullValues.includes(issue['ticket.customField:custom_field_7358641727757'])) {
                        // only show Sub-Category if RID codes are filled out
                        client.invoke('ticketFields:custom_field_360029295931.show');
                    } else {
                        client.set('ticket.customField:custom_field_360029295931', "");
                        client.invoke('ticketFields:custom_field_360029295931.hide');
                    }
                }
            } else if (e.propertyName === 'ticket.custom_field_360038857891') {
                // Handle RFC Changes
                handleRFCEvent(e)
            } else if (e.propertyName === 'ticket.custom_field_360044733732') {
                // Handle HR OnDemand Changes
                handleHROEvent(e)
            } else {
                // Handle Other Changes
                handleChangeEvent(e)
            }
        })

        setInterval(async function () {
            try {
                await client.invoke('ticketFields:type.show')
            } catch (e) { }
        }, 5000)
    })
}

async function handleHROEvent(event) {
    const propName = event.propertyName
    const propValue = event.newValue

    try {
        // Create empty array for valid field options
        let validCategoryOptions = []
        let validSubcategoryOptions = []

        // Determine the correct field values by selected module
        switch (propValue) {
            case 'hro_module_risk_management':
                validCategoryOptions = ['hro_category_question', 'hro_category_issue', 'hro_category_request', 'hro_category_best_practices', 'hro_category_other']
                validSubcategoryOptions = ['hro_subcategory_claims_guidance', 'hro_subcategory_forms_documentation', 'hro_subcategory_quote', 'hro_subcategory_regulations', 'hro_subcategory_risk_safety', 'hro_subcategory_training', 'hro_subcategory_other']
                break;
            case 'hro_module_hr':
                validCategoryOptions = ['hro_category_question', 'hro_category_issue', 'hro_category_request', 'hro_category_best_practices', 'hro_category_other']
                validSubcategoryOptions = ['hro_subcategory_claims_guidance', 'hro_subcategory_forms_documentation', 'hro_subcategory_handbook', 'hro_subcategory_regulations', 'hro_subcategory_training', 'hro_subcategory_unemployment', 'hro_subcategory_other']
                break;
            default:
                validCategoryOptions = []
                validSubcategoryOptions = []
                break;
        }

        // Update the field values
        const categoryField = await client.get('ticketFields:custom_field_360043716591.optionValues')
        const categoryValues = categoryField['ticketFields:custom_field_360043716591.optionValues']

        const subCategoryField = await client.get('ticketFields:custom_field_360043716611.optionValues')
        const subCategoryValues = subCategoryField['ticketFields:custom_field_360043716611.optionValues']

        await filterValidHROCategoryOptions(categoryValues, validCategoryOptions)
        await filterValidHROSubcategoryOptions(subCategoryValues, validSubcategoryOptions)
    } catch (e) { console.info(`ERROR: ${e}`) }
}

async function handleRFCEvent(event) {
    const propName = event.propertyName
    const propValue = event.newValue

    try {
        // Create empty array for valid field options
        let validOptions = []

        switch (propValue) {
            case 'wfm_uk_rfc':
                validOptions = ['uk_hr_rfc', 'uk_payroll_rfc', 'ess_api_rfc', 'labour_productivity_rfc', 'labour_productivity_shift_api_rfc', 'uk_ats_rfc', 'mobile_ui_employee_self_service_rfc',
                    'mobile_ui_my_schedule_rfc', 'mobile_ui_predictive_scheduling_report_rfc', 'mobile_ui_survey_app_rfc', 'shift_management_api', 'shift_gateway_api', 'labour_productivity_for_hotels_rfc',
                    'fourth_prediction_engine', 'other_rfc']
                break;
            case 'wfm_us_rfc':
                validOptions = ['abf_activity_based_forecasting_rfc', 'asc_above_store_console_rfc', 'essentials_rfc', 'labor_rfc', 'logbook_rfc', 'schoox_rfc',
                    'time__attendance_rfc', 'global_nav_rfc', 'insights_rfc', 'kpi_s_rfc', 'workflow_rfc', 'user_provisioning_rfc', 'asc_above_store_console_rfc',
                    'integration_svs_rfc', 'payroll_bureau_aso_rfc', 'payroll_peo_rfc', 'mobile_app_hs_and_team_rfc', 'hs_labor_emea_rfc']
                break;
            case 'wfm_global_rfc':
                validOptions = ['psma', 'labour_productivity_for_hotels_rfc', 'hr_data_importer_service_rfc', 'hr_data_importer_ui_rfc', 'hr_gateway_api_rfc',
                    'payroll_feed_service_admin_rfc', 'payroll_feed_service_api_rfc', 'peo_services_rfc', 'prepaid_connector_rfc', 'rules_admin_api_rfc', 'rules_admin_ui_rfc',
                    'prismhr_api_integrator_rfc', 'prismhr_import_service_rfc', 'prismhr_sso_rfc', 'raw_hr_data_processor_rfc', 'thi_payroll_connector_rfc',
                    'predictive_scheduling_service_rfc', 'analytics_hub_rfc', 'gross_wage_engine_', 'employment_management_service', 'tnt_service', 'hr_provider',
                    'timecard_history_importer', 'cup_connector', 'employment_management_service_rfc', 'tnt_service_rfc', 'timecard_history_importer_rfc', 'hr_facade', 'other_rfc']
                break;
            case 'inventory_management_rfc':
                validOptions = ['purchasing_inventory_adaco_rfc', 'adaco_configuration_service_rfc', 'adaco_messagebus_listener_rfc', 'adaco_site_manager_rfc', 'adaco_sso_login_rfc',
                    'goods_receiving_api_rfc', 'inventory_api_rfc', 'product_catalogue_api_rfc', 'inventory_stock_r9__rfc', 'purchase_to_pay_trade_simple_rfc', 'eparts_rfc',
                    'purchasing_api_rfc', 'fnb_classic_rfc', 'recipe_menu_engineering_starchef_rfc', 'menu_service_api_rfc', 'mobile_ui_counting_rfc', 'mobile_ui_menu_cycles_rfc',
                    'mobile_ui_ordering_rfc', 'mobile_ui_purchasing_admin_rfc', 'mobile_ui_receiving_rfc', 'mobile_ui_requisitions_rfc', 'mobile_ui_transfer_rfc', 'mobile_ui_wastage_rfc',
                    'macromatix_qsr_rfc', 'macromatix_qsr_rfc_mdcn', 'macromatix_qsr_rfc_cfa', 'inventory_hs_count_rfc', 'forecasting_clarifi_rfc', 'stock_sales_api', 'other_rfc', 'transfer_service_api']
                break;
            case 'platform_data___services_rfc':
                validOptions = ['file_service_rfc', 'canonical_lambdas_rfc', 'integration_lambdas__toast__aloha__brink__etc_rfc', 'agent_service_rfc', 'event_bridge_rfc', 'tools_rfc', 'pos_etl_rfc',
                    'agents_rfc', 'agents_based_apps_rfc', 'fas_2.0', 'epos_filewatcher_rfc', 'epos_gateway_rfc', 'fas_ui_rfc', 'fas_webapp_rfc', 'feed_service_rfc',
                    'feed_service_api_rfc', 'fourth_account_service_rfc', 'layer_7_rfc', 'notification_service_rfc', 'notification_templates_rfc', 'oauth_api_rfc',
                    'oauth_server_rfc', 'oauth_ui_rfc', 'omnivore_connector_rfc', 'organisation_service_rfc', 'fourth_engage_rfc', 'pos_gateway_rfc',
                    'single_sign_on_rfc', 'task_service_rfc', 'user_impersonation_api_rfc', 'user_impersonation_ui_rfc', 'web_hook_service_rfc', 'fourth_app_android_rfc',
                    'fourth_app_ios_rfc', 'fourth_analytics_rfc', 'fourth_analytics_gateway_rfc', 'data_extraction_service_rfc', 'fourth_connect_rfc',
                    'salesforce_idm_rfc', 'purchase_order', 'ghs_upload_service', 'media_service', 'api_registry_service', 'user_management_', 'task_service',
                    'voucher_code', 'survey_app', 'connected_apps', 'other_rfc', 'distribution_engine_rfc', 'cup_backend', 'cup_ui', 'prediction_engine_rfc', 'nextgen_forecasting']
                break;
            case 'cloudops_rfc':
                validOptions = ['core_api_platform_rfc_co', 'core_t_a_platform_rfc_co', 'core_ui_platform_rfc_co', 'core_utility_rfc_co', 'operational_tooling_rfc_co',
                    'multi-platform_rfc_co', 'octopus_deploy_rfc_co', 'purchasing_inventory_adaco_rfc', 'purchase_to_pay_trade_simple_rfc', 'inventory_stock_r9__rfc',
                    'purchase_to_pay_trade_simple_rfc', 'fnb_classic_rfc', 'recipe_menu_engineering_starchef_rfc', 'macromatix_qsr_rfc', 'inventory_hs_count_rfc',
                    'forecasting_clarifi_rfc', 'eparts_rfc', 'uk_hr_rfc', 'uk_payroll_rfc', 'uk_ats_rfc', 'labour_productivity_rfc', 'labour_productivity_for_hotels_rfc',
                    'asc_above_store_console_rfc', 'goods_receiving_api_rfc', 'labor_rfc', 'logbook_rfc', 'schoox_rfc', 'layer_7_rfc', 'fourth_analytics_gateway_rfc',
                    'fourth_account_service_rfc', 'single_sign_on_rfc', 'other_rfc', 'epos_gateway_rfc', 'fourth_connect_rfc', 'hs_labor_emea_rfc', 'macromatix_qsr_rfc_mdcn',
                    'macromatix_qsr_rfc_cfa', 'hotschedules_rfc']
                break;
            case 'internal_it_rfc':
                validOptions = ['other_rfc', 'corporate_it_application_maintenance_rfc', 'corporate_it_hardware_maintenance_rfc', 'corporate_it_licence_management_rfc',
                    'corporate_it_network_maintenance_rfc', 'corporate_it_security_maintenance_rfc', 'corporate_it_server_maintenance_rfc', 'corporate_it_user_maintenance_rfc']
                break;
            case 'fourth_rfc':
                validOptions = ['3rd_party_rfc', 'red_book_keep_rfc', 'cash_management_us_rfc', 'digital_red_book_rfc', 'adjacencies_rfc', 'procurement_rfc', 'gohire_rfc',
                    'rally_rfc', 'fti_rfc']
                break;
            case 'financial_services':
                validOptions = ['cash_deposit_locations_rfc', 'other_rfc', 'admin_site', 'azure_active_directory_b2c_rfc', 'bank_file_importer_rfc', 'ewa_api', 'onboarding_api',
                    'admin_api', 'banking_', 'employees_import', 'jobs_import', 'notifications_component', 'worker_profile_manager', 'tna_webhooks_rfc', 'zendesk_connector',
                    'fuego_app__android_', 'fuego_app__ios_', 'ewa_tips_importer', 'worker_agreement_manager', 'address_validator_api_rfc']
                break;
            default:
                validOptions = []
                break;
        }

        const ticketField = await client.get('ticketFields:custom_field_360038929832.optionValues')
        const fieldValues = ticketField['ticketFields:custom_field_360038929832.optionValues']

        await filterValidRFCModuleOptions(fieldValues, validOptions)
    } catch (e) { console.info(`ERROR: ${e}`) }
}

async function handleCategoryEvent(event) {
    const propName = event.propertyName
    const propValue = event.newValue

    try {
        // Create empty array for valid field options
        let validOptions = []

        switch (propValue) {
            case "3rd_party_data":
                validOptions = ['head_office_redirect_-_invalid', 'api', 'budgets', 'client_download', 'data', 'ftp_file_transfer', 'import_service', 'intolerances', 'pos', 'pos_gateway_sales', 'suppliers']
                break
            case "accounting":
                validOptions = ['head_office_redirect_-_invalid', 'accounting_reports', 'accounting_setup', 'accounts_payable', 'budgets', 'general_ledger', 'invoices', 'period_reporting']
                break
            case "administration":
                validOptions = ['head_office_redirect_-_invalid', 'academy_settings', 'access_level_hierarchy', 'access/permissions', 'account_cancellation', 'add_new_user', 'api', 'budgets', 'company_admin', 'company_setup', 'configuration', 'deduction_types', 'employee_summary', 'employment_allowance', 'fourth_account_creation', 'global_settings', 'handhelds', 'inactive_account', 'intolerances', 'job_templates', 'letters', 'levels', 'license_exceeded', 'license_expired', 'license_expiry', 'location_management', 'minimum_staffing', 'p32', 'p60', 'payment_methods', 'payroll_reporting/generation', 'pdq', 'pension_history', 'pension_uplift', 'portal_rollover', 'post_jobs', 'reporting', 'revenue_types', 'rollbacks', 'sales_force', 'server_issues', 'sftp', 'shift_types', 'skill_management', 'stages', 'suppliers', 'trainers', 'wage_cost', 'wage_function_settings', 'subcategory_wagestream', 'subcat_other']
                break
            case "ats_administration":
                validOptions = ['head_office_redirect_-_invalid', 'access__sso_', 'access', 'atsta', 'ats_documents', 'common_features', 'delete', 'email/sms', 'gdpr_query', 'latency_/_performance', 'notifications', 'requested_change', 'roll_back/forwards', 'subcategory_reporting', 'talent_pool', 'user_setup/management']
                break
            case "administrator":
                validOptions = ['accessing_my_account', 'account_settings', 'account_suspension', 'account_verification', 'assessments', 'background_check', 'billing', 'campaign_management', 'account_cancellation', 'career_page', 'employee_onboarding', 'offboarding', 'hired_by_snagajob', 'hiring_events', 'i-9/e-verify', 'subcat_integration_issue', 'managing_applications_/_candidates', 'managing_existing_employees', 'managing_postings', 'subcat_other', 'performance_hiring', 'subcategory_reporting', 'requested_refund', 'tax_credit_processing', 'technical_issue', 'terms_of_service']
                break
            case "applicant":
                validOptions = ['accessing_my_account', 'account_settings', 'background_check', 'completing_an_application', 'delete_account', 'hired_by_snagajob', 'subcat_other', 'performance_hiring', 'question_about_a_job', 'technical_issue', 'terms_of_service', 'video/phone_interview']
                break
            case "asc_config_communication":
                validOptions = ['head_office_redirect_-_invalid', 'access_level_hierarchy', 'access/permissions', 'employee_mgmt', 'personal_details', 'preloads/surveys', 'users', 'subcat_other']
                break
            case "bank_deposit":
                validOptions = ['head_office_redirect_-_invalid', 'date_issue', 'subcat_other', 'templates', 'escalation_to_3rd_party', 'missing', 'media_type_mapping', 'deposit_approval_status', 'cash_deposits/payouts']
                break
            case "benefits":
                validOptions = ['head_office_redirect_-_invalid', 'employee_pension_history', 'insurance', 'pension_history', 'pension_transfers', 'pension_uplift', 'tax_/_tax_forms']
                break
            case "career_site_portal":
                validOptions = ['head_office_redirect_-_invalid', 'latency', 'missing_vacancy', 'requested_change', 'search_by_distance', 'search_by_location']
                break
            case "cash_management":
                validOptions = ['head_office_redirect_-_invalid', 'cash_deposits/payouts', 'cube', 'subcat_other']
                break
            case "cash_up":
                validOptions = ['head_office_redirect_-_invalid', 'cash_up_approval_status', 'cash_up_report', 'date_issue', 'escalation_to_3rd_party', 'media_type_mapping', 'subcat_other', 'templates']
                break
            case "content":
                validOptions = ['head_office_redirect_-_invalid', 'courses', 'curriculums', 'exams', 'library', 'subcat_other']
                break
            case "contracts___offers":
                validOptions = ['head_office_redirect_-_invalid', '3rd_party_error', 'subcat_configuration', 'deleted', 'document_request', 'failed_webhook', 'incompleted', 'incorrect_email_address', 'not_received', 'not_received__widget_stage_', 'requested_change', 'rollback_request', 'sent_and_opened', 'sent_not_opened', 'unable_to_send', 'user_error']
                break
            case "counting":
                validOptions = ['head_office_redirect_-_invalid', 'access/permissions', 'close_period', 'handhelds', 'interim_inventory', 'subcategory_inventory', 'products', 'stock_count']
                break
            case "category_digital_red_book":
                validOptions = ['head_office_redirect_-_invalid', 'library', 'notes', 'subcategory_settings', 'tasks', 'subcat_other']
                break
            case "dashboard":
                validOptions = ['head_office_redirect_-_invalid', 'cosmetic_issue', 'incorrect_data', 'missing_data', 'requested_change']
                break
            case "documents":
                validOptions = ['head_office_redirect_-_invalid', 'batches', 'edi', 'failed', 'missing', 'receipts', 'resend', 'stuck', 'suppliers']
                break
            case "employee":
                validOptions = ['accessing_my_account', 'account_settings', 'background_check', 'delete_account', 'employee_onboarding', 'hired_by_snagajob', 'subcat_other', 'performance_hiring', 'technical_issue', 'terms_of_service', 'video/phone_interview']
                break
            case "employee_self_service__ess_":
                validOptions = ['head_office_redirect_-_invalid', 'access/permissions', 'subcategory_administration', 'api', 'email_issues', 'employee_info/history', 'expenses', 'holidays', 'insurance', 'payslips', 'rotas', 'tax_/_tax_forms']
                break
            case "employees":
                validOptions = ['head_office_redirect_-_invalid', 'attachment_orders', 'candidates', 'certifications', 'comments/feedback', 'courses', 'create/edit_jobs', 'divisions', 'document_management', 'employee_info/history', 'groups', 'holidays', 'internal_support', 'news_feed', 'notes', 'notifications', 'payslips', 'personal_details', 'rotas', 'succession_planning', 'subcategory_wagestream', 'welcome_sheet/_reset_password_email', 'subcat_other']
                break
            case "employment_details":
                validOptions = ['head_office_redirect_-_invalid', 'absences', 'attachment_orders', 'create/edit_jobs', 'deduction_types', 'divisions', 'document_management', 'employee_info/history', 'employee_payments', 'employee_summary', 'employment_allowance', 'expenses', 'holidays', 'insurance', 'login_issue', 'multiple_employment', 'nic', 'opt_in/opt_out', 'p11_uploads', 'pay___tax_details', 'payslips', 'pension_calculator', 'pension_history', 'pension_uplift', 'personal_details', 'proration', 'rollbacks', 'rotas', 'smp/spp/sap/shpp', 'smp/spp/ssp', 'ssp/csp', 'suspension', 'tax_/_tax_forms', 'termination']
                break
            case "end_users":
                validOptions = ['head_office_redirect_-_invalid', 'application_issues', 'cv', 'incorrect_account_details', 'incorrect_email_address', 'latency', 'unable_to_login']
                break
            case "category_engage":
                validOptions = ['head_office_redirect_-_invalid', 'access/permissions', 'subcategory_administration', 'client_download', 'comments/feedback', 'email_issues', 'employee_directory', 'fourth_account_creation', 'groups', 'location_management', 'notifications', 'personal_details', 'posting', 'tags', 'view/compose/delete_message', 'welcome_sheet/_reset_password_email']
                break
            case "failed_validation":
                validOptions = ['head_office_redirect_-_invalid', 'configuration_error__ps_', 'configuration_error__ats_', 'connecting_to_service', 'country_not_found', 'division_not_found', 'invalid_bank_details', 'invalid_rate_of_pay', 'invalid_applicant_details', 'job_title_not_found', 'location_not_found', 'missing_company_pay-basis', 'paid_by_rota', 'passport/ni_number_in-use', 'unable_to_re-hire']
                break
            case "category_forecasting":
                validOptions = ['head_office_redirect_-_invalid', 'budgets', 'configuration', 'events', 'forecast_inaccurate', 'forecast_sales', 'generate_forecast/labor', 'labor_rules', 'post_forecast', 'weather', 'subcat_other']
                break
            case "fourth_account_service":
                validOptions = ['head_office_redirect_-_invalid', 'access/permissions', 'api', 'email_issues', 'location_management', 'source_systems']
                break
            case "gdpr_request":
                validOptions = ['head_office_redirect_-_invalid', 'support_action_required', 'no_support_action_required']
                break
            case "gooddata_gateway":
                validOptions = ['head_office_redirect_-_invalid', 'api', 'data', 'provisioning_customers', 'resend']
                break
            case "gross_wage_engine":
                validOptions = ['head_office_redirect_-_invalid', 'wage_cost']
                break
            case "hardware":
                validOptions = ['head_office_redirect_-_invalid', 'corrupt_db', 'handhelds', 'missing_icon', 'printers', 'reinstall', 'server_issues', 't_a_biometric_machine']
                break
            case "home":
                validOptions = ['head_office_redirect_-_invalid', 'availability/shift_approval', 'manage_time_off', 'payslips', 'preloads/surveys', 'punch_record_approval_history', 'shift_ratings', 'shift_transactions', 'time_off/requests', 'view_schedule', 'subcat_other']
                break
            case "hr_gateway":
                validOptions = ['head_office_redirect_-_invalid', 'api', 'import_service', 'resend']
                break
            case "ingredients":
                validOptions = ['head_office_redirect_-_invalid', 'creation', 'intolerances', 'nutritional_values', 'products']
                break
            case "integration":
                validOptions = ['head_office_redirect_-_invalid', 'accounting_setup', 'agent/platform', 'api', 'edi', 'ftp_file_transfer', 'general_ledger', 'hs_connect', 'ipor', 'job_stuck', 'livelink', 'location_management', 'merged_users', 'subcategory_missing_employees', 'missing_jobs', 'pos', 'pos_gateway_sales', 'punchout', 'subcategory_stopped_syncing', 'suppliers', 't_a_epos', 'task_manager', 'us_foods', 'vendors', 'escalation_to_3rd_party']
                break
            case "interviews":
                validOptions = ['head_office_redirect_-_invalid', 'cannot_accept', 'calendar_issue', 'latency', 'not_generating', 'requested_change', 'roll_back/forwards']
                break
            case "category_inventory":
                validOptions = ['head_office_redirect_-_invalid', 'close_period', 'count', 'deliveries', 'edi', 'interim_inventory', 'subcategory_inventory', 'maintain_guides', 'order_trace_request', 'products', 'purchase_order_enquiry', 'reverse_close', 'reverse_start', 'rollbacks', 'site_transfer', 'start_inventory', 'stock_count', 'stock_period', 'stuck', 'transfers', 'vendors', 'subcat_other']
                break
            case "category_invoices":
                validOptions = ['head_office_redirect_-_invalid', 'batches', 'failed', 'missing', 'notifications', 'purchase_order_enquiry', 'resend', 'status', 'stuck', 'suppliers']
                break
            case "ivr":
                validOptions = ['head_office_redirect_-_invalid', 'api', 'subcategory_ivr']
                break
            case "jobs":
                validOptions = ['head_office_redirect_-_invalid', 'add_advertising', 'career_site', 'create/edit_jobs', 'job_templates', 'server_issues', 'subcat_other']
                break
            case "job_applications":
                validOptions = ['head_office_redirect_-_invalid', 'stuck_on_step', 'invalid_status', 'unable_to_progress', 'unable_to_regret', 'unable_to_progress_in_bulk', 'unable_to_regret_in_bulk', 'requested_change', '3rd_party_error', 'killer_questions']
                break
            case "cat_locations":
                validOptions = ['head_office_redirect_-_invalid', 'career_site_issue', 'subcat_configuration', 'location_management', 'misconfiguration', 'remove']
                break
            case "category_logbook":
                validOptions = ['head_office_redirect_-_invalid', 'configuration', 'contacts', 'finances', 'library', 'store_logs', 'tags', 'task_list_mgmt/reporting', 'tasks', 'to-do_s', 'subcat_other']
                break
            case "loyalty":
                validOptions = ['head_office_redirect_-_invalid', 'subcategory_loyalty']
                break
            case "manage_subscriptions":
                validOptions = ['head_office_redirect_-_invalid', 'access/permissions', 'account_cancellation', 'subcategory_administration', 'configuration', 'inactive_account', 'license_exceeded', 'license_expired', 'license_expiry', 'tags', 'subcat_other']
                break
            case "manager":
                validOptions = ['accessing_my_account', 'account_settings', 'assessments', 'background_check', 'campaign_management', 'career_page', 'employee_onboarding', 'offboarding', 'hired_by_snagajob', 'hiring_events', 'i-9/e-verify', 'subcat_integration_issue', 'managing_applications_/_candidates', 'managing_existing_employees', 'managing_postings', 'subcat_other', 'performance_hiring', 'subcategory_reporting', 'requested_refund', 'tax_credit_processing', 'technical_issue', 'terms_of_service']
                break
            case "market_lists":
                validOptions = ['head_office_redirect_-_invalid', 'missing', 'products', 'uploads']
                break
            case "menu":
                validOptions = ['head_office_redirect_-_invalid', 'creation', 'ingredient_replacement', 'intolerances', 'unlocking_menus']
                break
            case "menu_cycles":
                validOptions = ['head_office_redirect_-_invalid', 'ingredient_replacement', 'menu_cycle']
                break
            case "messaging":
                validOptions = ['head_office_redirect_-_invalid', 'broadcast_messaging', 'comments/feedback', 'subcategory_settings', 'support_-_remove_message', 'view/compose/delete_message', 'subcat_other']
                break
            case "miscellaneous/other":
                validOptions = ['head_office_redirect_-_invalid', 'account_cancellation', 'account_mgmt_portal', 'api', 'browser_issue', 'change_of_ownership', 'clear_test_sales', 'client_download', 'comments/feedback', 'copy_production_to_training', 'data', 'email_issues', 'error', 'forgot_username/password', 'good_data', 'holidays', 'incorrect_url', 'subcat_infrastructure', 'internal_support', 'internet_issue__customer_end_', 'subcategory_inventory', 'job_stuck', 'latency', 'payment_methods', 'pc_issue__customer_', 'pdq', 'subcategory_receiving', 'server_issues', 'vendors', 'view/compose/delete_message', 'subcat_other']
                break
            case "ats_miscellaneous/other":
                validOptions = ['head_office_redirect_-_invalid', 'api', 'cosmetic_issue', 'database_', 'data_task', 'extract', 'good_data']
                break
            case "mobile_apps":
                validOptions = ['head_office_redirect_-_invalid', 'access/permissions', 'api', 'availability', 'client_download', 'comments/feedback', 'communication_settings', 'count', 'latency', 'subcategory_logbook', 'login_issue', 'notifications', 'p2p_ordering', 'photos', 'subcategory_receiving', 'reporting', 'search', 'subcategory_settings', 'shift_transactions', 'subcategory_sso', 'time_off/requests', 'vendors', 'view_schedule', 'view/compose/delete_message', 'subcategory_wagestream', 'welcome_sheet/_reset_password_email', 'subcat_other']
                break
            case "modifications":
                validOptions = ['head_office_redirect_-_invalid', 'global_settings', 'subcat_infrastructure', 'job_stuck', 'subcategory_modifications', 'payroll_reporting/generation', 'pension_transfers', 'products', 'purchase_order_enquiry', 'receiving_center', 'receiving_corrections', 'receiving_reports', 'rollbacks']
                break
            case "mypass":
                validOptions = ['head_office_redirect_-_invalid', 'access_level_hierarchy', 'access/permissions', 'login_issue', 'profile', 'welcome_sheet/_reset_password_email', 'subcat_other']
                break
            case "onboarding":
                validOptions = ['head_office_redirect_-_invalid', 'background_screenings', 'batches', 'candidates', 'e-verify', 'send/complete_onboarding', 'subcat_other']
                break
            case "ats_onboarding":
                validOptions = ['head_office_redirect_-_invalid', 'incorrect_documents', 'latency', 'missing_documents', 'partial_push', 'people_system_latency', 'push_text_issues', 'send/complete_onboarding', 'stuck/pending']
                break
            case "orders":
                validOptions = ['head_office_redirect_-_invalid', 'access/permissions', 'close_purchase_orders', 'confirmations', 'failed', 'invoices', 'missing', 'ordering', 'p2p_ordering', 'stuck', 'suppliers']
                break
            case "p2p_i_data":
                validOptions = ['head_office_redirect_-_invalid', 'data', 'ftp_file_transfer']
                break
            case "payroll_feed_service":
                validOptions = ['head_office_redirect_-_invalid', 'api']
                break
            case "pension":
                validOptions = ['head_office_redirect_-_invalid', 'employee_pension_history', 'pension_calculator', 'pension_diary', 'pension_history', 'pension_scheme', 'pension_statutory_information', 'pension_transfers', 'pension_uplift']
                break
            case "permissions/permission_groups":
                validOptions = ['head_office_redirect_-_invalid', 'add_permission', 'remove_permission', 'subcat_configuration', 'query', 'permission_breach']
                break
            case "project_request":
                validOptions = ['head_office_redirect_-_invalid', 'configuration_live', 'incident_live', 'configuration_pre-live', 'incident_pre-live', 'configuration_qai', 'incident_qai', 'subcat_implementation', 'data_task']
                break
            case "property":
                validOptions = ['head_office_redirect_-_invalid', 'subcategory_administration', 'data', 'products', 'setup', 'user_center', 'vendors']
                break
            case "purchasing":
                validOptions = ['head_office_redirect_-_invalid', 'close_purchase_orders', 'confirmations', 'create_pos_from_requisitions', 'create_return_order', 'deliveries', 'edi', 'fax_orders', 'import_service', 'menu_item', 'new_quotation', 'order_trace_request', 'ordering', 'p2p_ordering', 'products', 'program_center', 'project', 'purchase_order_enquiry', 'purge_purchase_order', 'purge_records', 'quotation_center', 'site_transfer', 'suppliers']
                break
            case "receiving":
                validOptions = ['head_office_redirect_-_invalid', 'batches', 'failed', 'missing', 'post_returns', 'prints_new_label', 'purchase_order_enquiry', 'receiving_center', 'receiving_corrections', 'resend']
                break
            case "recipes":
                validOptions = ['head_office_redirect_-_invalid', 'creation', 'events', 'ingredient_replacement', 'intolerances', 'subcategory_nutrition', 'pricing', 'production_planner', 'receiving_center', 'recipe_calculation', 'recipe_sales']
                break
            case "category_reports":
                validOptions = ['head_office_redirect_-_invalid', 'w2', 'accounting_reports', 'alerts', 'asc', 'budgets', 'customised_reports', 'exports', 'filters', 'forecasting_and_projecting', 'generate_forecast/labor', 'subcategory_inventory', 'labor_analysis', 'nominal_ledger', 'period_reporting', 'proforma', 'property_reports', 'purchasing_reports', 'receiving_reports', 'recipe_reports', 'reminder_set_up', 'requisition_reports', 'sales_summary_items', 'scheduled_reports', 'schedules___rosters', 'subcategory_settings', 'show/hide_jobs', 'staff___store', 'standard_reports', 'super_journal', 'wsr_discrepancy', 'subcat_other']
                break
            case "requisitions":
                validOptions = ['head_office_redirect_-_invalid', 'process_outlet_requisition', 'requisition_audit', 'requisition_center', 'requisition_export', 'templates', 'transfer_center']
                break
            case "right_to_work":
                validOptions = ['head_office_redirect_-_invalid', 'failed', 'stuck', 'missing', 'query', 'expired__90_days_', 'comments', 'incorrect_id', 'access']
                break
            case "roles":
                validOptions = ['head_office_redirect_-_invalid', 'subcat_configuration', 'misconfiguration', 'pay_rates', 'location_management', 'permissions', 'role_management', '3rd_party_error']
                break
            case "rota_management":
                validOptions = ['head_office_redirect_-_invalid', 'actual_sales', 'budgets', 'edit/copy/delete_schedules', 'forecast_sales', 'metrics', 'posting/unposting_schedule', 'rotas', 't_a_biometric_machine', 't_a_epos', 'tips/service_charge', 'view_schedule', 'wage_cost']
                break
            case "category_sales":
                validOptions = ['head_office_redirect_-_invalid', 'data', 'ftp_file_transfer', 'location_management', 'pos', 'pos_gateway_sales', 'resend', 'sales_inquiry']
                break
            case "salesforce":
                validOptions = ['head_office_redirect_-_invalid', 'access/permissions', 'api', 'fourth_account_creation', 'profile', 'reporting']
                break
            case "scheduling":
                validOptions = ['head_office_redirect_-_invalid', 'subcat_aca', 'actual_sales', 'autoscheduler', 'availability', 'budgets', 'edit/copy/delete_schedules', 'employee_mgmt', 'events', 'filters', 'forecast_sales', 'metrics', 'minor_rules', 'mpp/mbp', 'notifications', 'posting/unposting_schedule', 'restore_schedule', 'roster', 'rotas', 'scheduled_reports', 'scheduler_kpi_reports', 'subcategory_settings', 'shift_transactions', 'skill_management', 't_a_epos', 'templates', 'tips/service_charge', 'view_schedule', 'wage_cost', 'weather', 'work_week_change', 'subcategory_workflow', 'subcat_other']
                break
            case "settings":
                validOptions = ['head_office_redirect_-_invalid', 'subcat_aca', 'application_preferences', 'availability', 'browser_issue', 'certifications', 'communication_settings', 'company_admin', 'company_setup', 'configuration', 'email_issues', 'essentials_billing', 'e-verify', 'fourth_account_creation', 'handhelds', 'incorrect_url', 'subcategory_inventory', 'job_stuck', 'job_templates', 'login___security', 'manage_store_hours', 'menu_item', 'metrics', 'mpp/mbp', 'onboarding_preferences', 'products', 'profile', 'server_issues', 'stock_period', 'store_setting_edits/mappings', 'suppliers', 'text_messaging', 'upload_staff', 'wage_cost', 'wage_function_settings', 'subcat_other']
                break
            case "setup/login/access":
                validOptions = ['head_office_redirect_-_invalid', 'escalation_to_3rd_party', 'access_level_hierarchy', 'access/permissions', 'batches', 'browser_issue', 'communication_settings', 'company_admin', 'company_setup', 'create/edit_jobs', 'deduction_types', 'forgot_username/password', 'fourth_account_creation', 'global_settings', 'handhelds', 'inactive_account', 'incorrect_url', 'subcat_infrastructure', 'internal_support', 'latency', 'license_exceeded', 'license_expired', 'license_expiry', 'login_issue', 'menu_item', 'payroll_reporting/generation', 'setup_account', 'subcategory_sso', 'suppliers', 'user_system_issue', 'wage_cost', 'wage_function_settings', 'welcome_sheet/_reset_password_email', 'subcat_other']
                break
            case "staff":
                validOptions = ['head_office_redirect_-_invalid', 'subcat_aca', 'access/permissions', 'add_new_user', 'candidates', 'comments/feedback', 'employee_info/history', 'employee_mgmt', 'internal_support', 'job/schedule_mapping', 'welcome_sheet/_reset_password_email', 'subcat_other']
                break
            case "third_party_content":
                validOptions = ['head_office_redirect_-_invalid', '360_training', 'discoverlink']
                break
            case "category_time___attendance":
                validOptions = ['head_office_redirect_-_invalid', 'accounting_setup', 'alerts', 'api', 'configuration', 'earning_codes', 'manager_shifts', 'notifications', 'pay_rules', 'payroll_reporting/generation', 'punch_records/exceptions', 'reprocess_labor', 'split_wages', 't_a_biometric_machine', 'subcategory_time___attendance', 'tip_credit', 'wage_cost', 'subcat_other']
                break
            case "tronc/_tronc2":
                validOptions = ['head_office_redirect_-_invalid', 'actual_sales', 'allocation', 'divisions', 'employee_payments', 'receipts', 'rollbacks']
                break
            case "user_management":
                validOptions = ['head_office_redirect_-_invalid', 'access_level_hierarchy', 'access/permissions', 'add_new_user', 'subcategory_administration', 'company_admin', 'company_setup', 'inactive_account', 'login_issue', 'subcategory_sso', 'view/compose/delete_message', 'welcome_sheet/_reset_password_email', 'subcat_other']
                break
            case "vacancies":
                validOptions = ['head_office_redirect_-_invalid', 'cannot_open', 'cannot_close', 'missing_vacancy', 'missing_job_application', '3rd_party_job_board_error__ats_', '3rd_party_error', 'query', 'cosmetic_issue']
                break
            case "wagestream":
                validOptions = ['head_office_redirect_-_invalid', 'api', 'client_download', 'employee_payments', 'users']
                break
            case "webclock":
                validOptions = ['head_office_redirect_-_invalid', 'clock_in/out', 'configuration', 'launch_webclock', 'subcat_other']
                break
            case "wfm_data":
                validOptions = ['head_office_redirect_-_invalid', 'data', 'ftp_file_transfer']
                break
            case "workflow":
                validOptions = ['head_office_redirect_-_invalid', 'subcategory_administration', 'task_list_issue', 'subcat_other']
                break
            case "epos_t_a":
                validOptions = ['head_office_redirect_-_invalid', 'rotas', 'subcategory_scheduling']
                break
            case "synel_t_a":
                validOptions = ['head_office_redirect_-_invalid', 'knowledge_gap/user_error', 'call_out', 'portal_configuration', 'asset', 'middleware_incident', 'new_machine_order']
                break
            case "head_office_redirect":
                validOptions = ['head_office_redirect_-_invalid']
                break
            case "rotas_reports":
                validOptions = ['customised_reports', 'standard_reports', 'exports', 'head_office_redirect_-_invalid']
                break
            case "rotas_administration":
                validOptions = ['global_settings', 'metrics', 'rollbacks', 'configure_locations', 'wage_function_settings', 'configure_division', 'shift_types', 'fixed_cost_area', 'head_office_redirect_-_invalid']
                break
            case "rotas_management":
                validOptions = ['wage_cost', 'budgets', 'approvals', 'actual_sales', 'holidays', 'absences', 'multiple_employment', 'edit/copy/delete_schedules', 'submission', 'view_schedule', 'access/permissions', 'forecast_sales', 'employee_info/history', 'employee_mgmt', 'head_office_redirect_-_invalid']
                break
            default:
                validOptions = []
                break
        }

        const ticketField = await client.get('ticketFields:custom_field_360029295931.optionValues')
        const fieldValues = ticketField['ticketFields:custom_field_360029295931.optionValues']

        await filterValidSubCategoryOptions(fieldValues, validOptions)
    } catch (e) { console.info(`ERROR: ${e}`) }
}

async function handleModuleEvent(event) {
    const propName = event.propertyName
    const propValue = event.newValue

    try {
        // Create empty array for valid field options
        let validOptions = []

        switch (propValue) {
            case 'module_analytics':
                validOptions = ['head_office_redirect', '3rd_party_data', 'administration', 'fourth_account_service', 'gooddata_gateway', 'integration', 'miscellaneous/other', 'p2p_i_data',
                    'category_reports', 'wfm_data']
                break
            case 'analytics_-_admin':
                validOptions = ['head_office_redirect', '3rd_party_data', 'administration', 'gooddata_gateway', 'integration', 'miscellaneous/other', 'category_reports', 'wfm_data']
                break
            case 'ats__uk_':
                validOptions = ['head_office_redirect', 'ats_administration', 'ats_miscellaneous/other', 'career_site_portal', 'contracts___offers', 'end_users', 'dashboard', 'failed_validation', 'gdpr_request', 'interviews', 'job_applications', 'cat_locations', 'ats_onboarding', 'permissions/permission_groups', 'project_request', 'right_to_work', 'roles', 'vacancies']
                break
            case 'ats__us_':
                validOptions = ['head_office_redirect', 'administration', 'employees', 'integration', 'jobs', 'miscellaneous/other', 'mobile_apps', 'onboarding', 'category_reports']
                break
            case 'digital_red_book':
                validOptions = ['head_office_redirect', 'category_digital_red_book', 'manage_subscriptions', 'miscellaneous/other']
                break
            case "engage":
                validOptions = ['head_office_redirect', 'administration', 'category_engage', 'fourth_account_service', 'integration', 'miscellaneous/other', 'mobile_apps', 'category_reports',
                    'salesforce']
                break
            case "eparts":
                validOptions = ['head_office_redirect', 'administration', 'documents', 'integration', 'category_invoices', 'market_lists', 'miscellaneous/other', 'mobile_apps', 'orders',
                    'purchasing', 'receiving', 'category_reports', 'requisitions']
                break
            case "fnb":
                validOptions = ['head_office_redirect', 'administration', 'integration', 'category_inventory', 'miscellaneous/other', 'orders', 'purchasing', 'category_reports', 'category_sales']
                break
            case "forecasting__clarifi_":
                validOptions = ['head_office_redirect', 'category_forecasting', 'mypass', 'workflow']
                break
            case "gohire__mrc_":
                validOptions = ['head_office_redirect', 'administration', 'jobs', 'miscellaneous/other', 'onboarding', 'settings']
                break
            case "hotschedules_labor":
                validOptions = ['head_office_redirect', 'administration', 'asc_config_communication', 'category_forecasting', 'home', 'integration', 'ivr', 'category_logbook', 'messaging',
                    'miscellaneous/other', 'mobile_apps', 'mypass', 'category_reports', 'scheduling', 'settings', 'setup/login/access', 'staff', 'category_time___attendance',
                    'webclock']
                break
            case "hr__uk_":
                validOptions = ['head_office_redirect', 'administration', 'benefits', 'employee_self_service__ess_', 'employees', 'employment_details', 'fourth_account_service', 'hardware',
                    'hr_gateway', 'integration', 'miscellaneous/other', 'mobile_apps', 'category_reports', 'rota_management', 'category_time___attendance']
                break
            case "hr__us_":
                validOptions = ['head_office_redirect', 'administration', 'benefits', 'employees', 'employee_self_service__ess_', 'hr_gateway', 'integration', 'miscellaneous/other', 'mobile_apps',
                    'onboarding', 'category_reports', 'setup/login/access']
                break
            case "inventory__hs_count_":
                validOptions = ['head_office_redirect', 'counting', 'category_inventory', 'miscellaneous/other', 'mobile_apps']
                break
            case "inventory__stock_r9_":
                validOptions = ['head_office_redirect', 'administration', 'counting', 'fourth_account_service', 'integration', 'miscellaneous/other', 'mobile_apps', 'orders', 'purchasing',
                    'category_reports', 'category_sales']
                break
            case "labour_productivity":
                validOptions = ['head_office_redirect', 'administration', 'category_forecasting', 'fourth_account_service', 'gross_wage_engine', 'hr_gateway', 'integration', 'miscellaneous/other',
                    'mobile_apps', 'payroll_feed_service', 'category_reports', 'rota_management', 'category_sales', 'scheduling']
                break
            case "myschedules":
                validOptions = ['head_office_redirect', 'administration', 'category_forecasting', 'fourth_account_service', 'gross_wage_engine', 'hr_gateway', 'integration', 'miscellaneous/other',
                    'mobile_apps', 'payroll_feed_service', 'category_reports', 'rota_management', 'category_sales', 'scheduling']
                break
            case "demand_scheduling":
                validOptions = ['head_office_redirect', 'administration', 'category_forecasting', 'fourth_account_service', 'gross_wage_engine', 'hr_gateway', 'integration', 'miscellaneous/other',
                    'mobile_apps', 'payroll_feed_service', 'category_reports', 'rota_management', 'category_sales', 'scheduling']
                break
            case "activity-based_scheduling":
                validOptions = ['head_office_redirect', 'administration', 'category_forecasting', 'fourth_account_service', 'gross_wage_engine', 'hr_gateway', 'integration', 'miscellaneous/other',
                    'mobile_apps', 'payroll_feed_service', 'category_reports', 'rota_management', 'category_sales', 'scheduling']
                break
            case "logbook__standalone_":
                validOptions = ['head_office_redirect', 'category_logbook', 'staff']
                break
            case "macromatix":
                validOptions = ['head_office_redirect', 'financials', 'category_inventory', 'administration', 'category_forecasting', 'operations', 'category_reports', 'category_rds', 'labor',
                    'pos_integration', 'deploys', 'sql_dba', 'category_server_issues']
                break
            case "ordering__marketplace_":
                validOptions = ['head_office_redirect', 'administration', 'documents', 'fourth_account_service', 'integration', 'category_invoices', 'market_lists', 'miscellaneous/other',
                    'mobile_apps', 'orders', 'receiving', 'category_reports']
                break
            case "payroll__uk_":
                validOptions = ['head_office_redirect', 'administration', 'cash_management', 'employee_self_service__ess_', 'employment_details', 'fourth_account_service', 'integration',
                    'miscellaneous/other', 'mobile_apps', 'payroll_feed_service', 'pension', 'category_reports', 'tronc/_tronc2', 'wagestream']
                break
            case "payroll__us_":
                validOptions = ['head_office_redirect', 'administration', 'integration', 'miscellaneous/other', 'mobile_apps', 'payroll_feed_service', 'pension', 'category_reports']
                break
            case "purchase_to_pay__trade_simple_":
                validOptions = ['head_office_redirect', 'administration', 'documents', 'fourth_account_service', 'integration', 'category_invoices', 'market_lists', 'miscellaneous/other',
                    'mobile_apps', 'orders', 'receiving', 'category_reports']
                break
            case "purchasing_and_inventory__adaco_":
                validOptions = ['head_office_redirect', 'accounting', 'administration', 'category_handhelds', 'integration', 'category_inventory', 'mobile_apps', 'property', 'purchasing', 'receiving', 'recipes', 'category_reports', 'requisitions', 'category_sales', 'setup/login/access']
                break
            case "recipe_and_menus__starchef_":
                validOptions = ['head_office_redirect', 'administration', 'fourth_account_service', 'ingredients', 'integration', 'menu', 'menu_cycles', 'miscellaneous/other', 'nutrition', 'recipes',
                    'category_reports']
                break
            case "red_book_keep":
                validOptions = ['head_office_redirect', 'mobile_apps', 'modifications', 'category_sales', 'user_management']
                break
            case "single_sign-on":
                validOptions = ['head_office_redirect', 'employees', 'fourth_account_service', 'miscellaneous/other', 'mobile_apps', 'salesforce', 'wagestream']
                break
            case "train__schoox_":
                validOptions = ['head_office_redirect', 'administration', 'content', 'integration', 'miscellaneous/other', 'third_party_content']
                break
            case "cash_management__us_":
                validOptions = ['head_office_redirect', 'bank_deposit', 'cash_up', 'integration', 'miscellaneous/other', 'setup/login/access']
                break
            case "module_fuego":
                validOptions = ['head_office_redirect', 'administration', 'bank_deposit', 'employee_benefits', 'employment_details', 'mobile_apps', 'employee_details', 'banking_issue']
                break
            case "pm":
                validOptions = ['applicant', 'employee', 'manager', 'administrator']
                break
            case "hm":
                validOptions = ['applicant', 'employee', 'manager', 'administrator']
                break
            case "time_attendance_uk":
                validOptions = ['epos_t_a', 'synel_t_a']
                break
            case "rotas__uk":
                validOptions = ['rotas_reports', 'rotas_administration', 'rotas_management']
                break
            default:
                validOptions = []
                break
        }

        const ticketField = await client.get('ticketFields:custom_field_360029295891.optionValues')
        const fieldValues = ticketField['ticketFields:custom_field_360029295891.optionValues']

        await filterValidModuleCategoryOptions(fieldValues, validOptions)
    } catch (e) { console.info(`ERROR: ${e}`) }
}

async function handleMacromatixEvent(event) {
    const propName = event.propertyName
    const propValue = event.newValue

    try {
        // Create empty array for valid field options
        let validOptions = []

        switch (propValue) {
            case "financials":
                validOptions = ['sales_summary_items', 'banking', 'cashier_closes', 'register_closes', 'petty_cash', 'safe_count', 'store_float', 'subcategory_reporting',
                    'financial_groups', 'configuration']
                break
            case "category_inventory":
                validOptions = ['mpc_v1', 'mpc_v2__emp_c_', 'ordering', 'order_schedule', 'stock_count', 'transfers', 'waste', 'claims', 'subcategory_reporting',
                    'configuration', 'master_data_import']
                break
            case "administration":
                validOptions = ['store_setup', 'ho_configuration', 'employee_setup', 'production_setup', 'day_markers']
                break
            case "category_forecasting":
                validOptions = ['data_issue', 'subcategory_reporting', 'configuration', 'reprocess']
                break
            case "operations":
                validOptions = ['sales_dashboard', 'mobile_dashboard', 'production_dashboard', 'mobile_setup', 'configuration']
                break
            case "category_reports":
                validOptions = ['general_reports', 'inventory_reports', 'financial_reports', 'data_exports', 'data_imports']
                break
            case "category_rds":
                validOptions = ['missing_data', 'duplicate_data', 'sync_issues', 'custom_reports', 'subcategory_user_management', 'subcat_request_for_information', 'ip_whitelist']
                break
            case "labor":
                validOptions = ['employee_availability', 'subcategory_scheduling', 't/a', 'pay_rates', 'auto_gen', 'subcategory_reporting', 'configuration', 'employee_info/history', 'employee_setup']
                break
            case "pos_integration":
                validOptions = ['livelink_sync', 'arts_import', 'cloudlink', 'transfer_to_pdq']
                break
            case "deploys":
                validOptions = ['subcategory_staging', 'subcategory_testing', 'subcategory_production']
                break
            case "sql_dba":
                validOptions = ['subcat_request_for_information', 'data_fix_sql_-_billable', 'data_extraction_-_billable']
                break
            case "category_server_issues":
                validOptions = ['server_manager_tasks', 'server_performance_issues', 'alerts___notifications']
                break
            default:
                validOptions = []
                break
        }

        const ticketField = await client.get('ticketFields:custom_field_360029295931.optionValues')
        const fieldValues = ticketField['ticketFields:custom_field_360029295931.optionValues']

        await filterValidSubCategoryOptions(fieldValues, validOptions)
    } catch (e) { console.info(`ERROR: ${e}`) }
}

async function handleEWAEvent(event) {
    const propName = event.propertyName
    const propValue = event.newValue

    try {
        // Create empty array for valid field options
        let validOptions = []

        switch (propValue) {
            case "administration":
                validOptions = ['access/permissions', 'account_mgmt_portal', 'add_new_user', 'configuration', 'login_issue', 'payroll_reporting/generation', 'scheduled_reports', 'deduction_types', 'deduction_issue']
                break
            case "bank_deposit":
                validOptions = ['employee_payments']
                break
            case "banking_issue":
                validOptions = ['subcat_other']
                break
            case "employee_benefits":
                validOptions = ['payment_methods']
                break
            case "employee_details":
                validOptions = ['incorrect_account_details']
                break
            case "employment_details":
                validOptions = ['employee_payments']
                break
            case "mobile_apps":
                validOptions = ['fourth_account_creation', 'alerts___notifications', 'latency', 'login_issue', 'setup_account']
                break
            default:
                validOptions = []
                break
        }

        const ticketField = await client.get('ticketFields:custom_field_360029295931.optionValues')
        const fieldValues = ticketField['ticketFields:custom_field_360029295931.optionValues']

        await filterValidSubCategoryOptions(fieldValues, validOptions)
    } catch (e) { console.info(`ERROR: ${e}`) }
}

async function handleFuegoIssueEvent() {
    try {
        // Show Fuego Issue Dropdown
        client.invoke({
            'ticketFields:custom_field_360048176772.show': [],
            'ticketFields:custom_field_360029295891.hide': [], // hide category
            'ticketFields:custom_field_360029295931.hide': [] // hide sub-category
        })
        client.set({
            // set category and sub-category to null
            'ticket.customField:custom_field_360029295891': null,
            'ticket.customField:custom_field_360029295931': null
        });

    } catch (e) { console.log(e); }
}

async function handleAdacoEvent(event) {
    const propName = event.propertyName
    const propValue = event.newValue

    try {
        // Create empty array for valid field options
        let validOptions = []

        switch (propValue) {
            case "accounting":
                validOptions = ['accounts_payable', 'budgets', 'general_ledger', 'manual_invoices', 'subcat_other', 'period_reporting', 'rebates']
                break
            case "administration":
                validOptions = ['communication', 'customisation', 'data_synchronisation', 'general', 'subcategory_inventory', 'languages', 'license_exceeded',
                    'license_expired', 'message_of_the_day', 'order_layout', 'subcat_other', 'subcat_purchasing', 'subcategory_receiving', 'recipe', 'recipe_card_layout',
                    'reports_usage', 'subcat_requisitions', 'security']
                break
            case "category_handhelds":
                validOptions = ['corrupt_db', 'handhelds', 'subcat_other', 'printers', 'reinstall']
                break
            case "integration":
                validOptions = ['a/p', 'api', 'edi', 'escalation_to_3rd_party', 'ftp_file_transfer', 'general_ledger', 'ipor', 'job_stuck', 'subcat_other', 'peoplesoft/mbs',
                    'pos', 'punchout', 'tradesimple', 'us_foods', 'vendors']
                break
            case "category_inventory":
                validOptions = ['cancel_inventory_start', 'close_interim_inventory', 'close_period', 'interim_inventory', 'inventory_adjustment', 'inventory_cycle',
                    'maintain_guides', 'subcat_other', 'physical_inventory_count', 're-open_inventory', 'start_inventory']
                break
            case "mobile_apps":
                validOptions = ['access/permissions', 'subcategory_counting', 'notification/tasks', 'ordering', 'subcat_other', 'subcategory_receiving', 'subcategory_settings',
                    'subcategory_sso', 'transfers']
                break
            case "property":
                validOptions = ['data_export/import', 'data_synchronisation', 'subcat_other', 'products', 'user_center', 'vendors']
                break
            case "purchasing":
                validOptions = ['acknowledgement', 'close_purchase_orders', 'create_pos_from_requisitions', 'create_return_order', 'order_transmission', 'subcat_other',
                    'products_quotes', 'program_center', 'project', 'purchase_order_enquiry', 'purchasing_order_center', 'purge_reorders', 'quotation_center', 'standing_order_center']
                break
            case "receiving":
                validOptions = ['comments', 'invoice', 'subcat_other', 'post_returns', 'print_label', 'rates', 'receiving_center', 'receiving_corrections']
                break
            case "recipes":
                validOptions = ['creation', 'events', 'ingredient_replacement', 'intolerances', 'subcategory_nutrition', 'pricing', 'production_planner',
                    'recipe_calculation', 'recipe_setup', 'subcat_other']
                break
            case "category_reports":
                validOptions = ['accounting_reports', 'custom_reports', 'exports', 'inventory_reports', 'subcat_other', 'property_reports', 'purchasing_reports',
                    'receiving_reports', 'recipe_reports', 'requisition_reports']
                break
            case "requisitions":
                validOptions = ['approvals', 'outlet_requisition', 'process_outlet_requisition', 'purchase_requisition', 'requisition_audit', 'requisition_export',
                    'templates', 'transfer_center']
                break
            case "category_sales":
                validOptions = ['ftp_file_transfer', 'pos', 'pos_gateway_sales']
                break
            case "setup/login/access":
                validOptions = ['subcat_accounting', 'categories', 'location', 'subcategory_nutrition', 'subcat_other', 'product_attributes', 'rates', 'return_materials_authorization',
                    'routing', 'user_groups', 'vendor_performance']
                break
            default:
                validOptions = []
                break
        }

        const ticketField = await client.get('ticketFields:custom_field_360029295931.optionValues')
        const fieldValues = ticketField['ticketFields:custom_field_360029295931.optionValues']

        await filterValidSubCategoryOptions(fieldValues, validOptions)
    } catch (e) { console.info(`ERROR: ${e}`) }
}

async function handleRBSEvent(event) {
    const propName = event.propertyName
    const propValue = event.newValue

    try {
        // Create empty array for valid field options
        let validOptions = []

        switch (propValue) {
            case 'printcasestatus_1':
                validOptions = ['printcaseissue_7', 'printcaseissue_8', 'printcaseissue_9', 'printcaseissue_10', 'printcaseissue_42']
                break
            case 'printcasestatus_2':
                validOptions = ['printcaseissue_11', 'printcaseissue_12']
                break
            case 'printcasestatus_3':
                validOptions = ['printcaseissue_14', 'printcaseissue_16', 'printcaseissue_17', 'printcaseissue_18', 'printcaseissue_42', 'printcaseissue_43']
                break
            case 'printcasestatus_4':
                validOptions = ['printcaseissue_19', 'printcaseissue_20', 'printcaseissue_21', 'printcaseissue_22', 'printcaseissue_23', 'printcaseissue_37']
                break
            case 'printcasestatus_5':
                validOptions = ['printcaseissue_27', 'printcaseissue_28', 'printcaseissue_29']
                break
            case 'printcasestatus_6':
                validOptions = ['printcaseissue_30', 'printcaseissue_31', 'printcaseissue_32']
                break
            case 'printcasestatus_7':
                validOptions = ['printcaseissue_42', 'printcaseissue_24', 'printcaseissue_25']
                break
            default:
                validOptions = []
                break
        }

        const ticketField = await client.get('ticketFields:custom_field_114103052712.optionValues')
        const fieldValues = ticketField['ticketFields:custom_field_114103052712.optionValues']

        await filterValidRBSCaseIssueOptions(fieldValues, validOptions)
    } catch (e) { console.info(`ERROR: ${e}`) }
}

async function handleChangeEvent(event) {
    const propName = event.propertyName
    const propValue = event.newValue

    try {
        // Create empty arrays for field options
        let validProducts = []
        let validPlatforms = []
        let validFeatureSets = []
        let validIssueTypes = []

        let productOptions = []
        let platformOptions = []
        let featureSetOptions = []
        let issueTypesOptions = []

        // Get Ticket Data
        const { ticket } = await client.get('ticket')
        let ticketFormId = ticket.form.id

        // If the changed value is not the Ticket Form or the Product field, return
        if (propName != 'ticket.form.id' && propName != 'ticket.custom_field_27990808') { return }

        if (ticketFormId == '98337' || ticketFormId == '121177' || ticketFormId == '211608' || ticketFormId == '210368') {
            // If Form is any of the following:
            // "General CC Ticket Form - OLD"
            // "Issue - Customer Care General"
            // "Issue - MX"
            // "Historical Import Tickets"

            // Get the Platform field options and store to array
            const platformField = await client.get('ticketFields:custom_field_28917647.options')
            platformOptions = platformField['ticketFields:custom_field_28917647.options']

            // Gather more data if Form is "Issue - Customer Care General" OR "Issue - MX"
            if (ticketFormId == '121177' || ticketFormId == '211608') {
                // Get the Feature Set field options and store to array
                const featureSetField = await client.get('ticketFields:custom_field_29193898.options')
                featureSetOptions = featureSetField['ticketFields:custom_field_29193898.options']
            }

            // If the changed value is not empty or null, hide all Platform options
            if (propValue !== '' && propValue !== null && propValue !== 'null') {
                await hideAllPlatformOptions(platformOptions)
            }
        }

        // If the changed property was the Ticket Form
        if (propName == 'ticket.form.id') {
            ticketFormId = propValue

            // If Form is "Issue - Customer Care General" OR "Issue - MX"
            if (ticketFormId == '121177' || ticketFormId == '211608') {
                // Get the Issue Types field options and store to array
                const issueTypesField = await client.get('ticketFields:custom_field_29567977.options')
                issueTypesOptions = issueTypesField['ticketFields:custom_field_29567977.options']

                // Show all Platform and Issue Type options
                await showAllPlatformOptions(platformOptions)
                await showAllIssueTypeOptions(issueTypesOptions)
            }

            if (ticketFormId == '121177') { // If Form is "Issue - Customer Care General"
                // Define valid list of Platform and Issue Type options
                validPlatforms = ['platform_2', 'platform_4', 'platform_15', 'platform_18', 'platform_20', 'platform_47', 'platform_50', 'platform_52', 'platform_56']
                validIssueTypes = ['issuetype_1', 'issuetype_10', 'issuetype_12', 'issuetype_13', 'issuetype_19', 'issuetype_20', 'issuetype_27', 'issuetype_28', 'issuetype_29', 'issuetype_30', 'issuetype_31']

                await filterValidPlatformOptions(platformOptions, validPlatforms)
                await filterValidIssueTypeOptions(issueTypesOptions, validIssueTypes)
            } else if (ticketFormId == '211608') { // If Form is "Issue - MX"
                // Define valid list of Platform and Issue Type options
                validPlatforms = ['platform_11', 'platform_16', 'platform_17', 'platform_18', 'platform_2', 'platform_20', 'platform_22', 'platform_23', 'platform_24',
                    'platform_25', 'platform_26', 'platform_27', 'platform_28', 'platform_29', 'platform_30', 'platform_31', 'platform_32', 'platform_33', 'platform_34',
                    'platform_35', 'platform_36', 'platform_37', 'platform_38', 'platform_39', 'platform_4', 'platform_40', 'platform_41', 'platform_42', 'platform_43',
                    'platform_44', 'platform_45', 'platform_46', 'platform_47', 'platform_49', 'platform_50', 'platform_51', 'platform_52', 'platform_54', 'platform_55',
                    'platform_9']
                validIssueTypes = ['issuetype_20']

                await filterValidPlatformOptions(platformOptions, validPlatforms)
                await filterValidIssueTypeOptions(issueTypesOptions, validIssueTypes)
            } else if (ticketFormId == '98337' || ticketFormId == '200798' || ticketFormId == '210368') { // Other Forms
                // Make sure all Platform options are shown
                await showAllPlatformOptions(platformOptions)
            }
        } else if (propName == 'ticket.custom_field_27990808') { // If Product Field was changed
            // Show all Platform options
            await showAllPlatformOptions(platformOptions)

            // Define valid option lists based on selected Product
            switch (propValue) {
                case 'product_2':
                    validPlatforms = ['platform_11', 'platform_15', 'platform_2', 'platform_9', 'platform_3', 'platform_7', 'platform_16', 'platform_8', 'platform_17', 'platform_19', 'platform_54', 'platform_55', 'platform_4', 'platform_56']
                    break
                case 'product_3':
                    validPlatforms = ['platform_11', 'platform_15', 'platform_4', 'platform_2', 'platform_9', 'platform_3', 'platform_7', 'platform_16', 'platform_8', 'platform_17', 'platform_19', 'platform_56']
                    break
                case 'product_5':
                    validPlatforms = []
                    break
                case 'product_10':
                    validPlatforms = ['platform_18']
                    break
                case 'product_13':
                    validPlatforms = ['platform_20']
                    break
                case 'product_14':
                    validPlatforms = ['platform_9', 'platform_21']
                    break
                case 'product_15':
                    validPlatforms = ['platform_44']
                    break
                case 'product_16':
                    validPlatforms = ['platform_22', 'platform_23', 'platform_24', 'platform_25', 'platform_26', 'platform_27', 'platform_28', 'platform_29', 'platform_30', 'platform_31', 'platform_32', 'platform_33', 'platform_34', 'platform_35', 'platform_36', 'platform_37', 'platform_38', 'platform_39', 'platform_40', 'platform_41', 'platform_42', 'platform_43', 'platform_45', 'platform_46', 'platform_49']
                    validFeatureSets = ['featureset_86', 'featureset_88', 'featureset_89', 'featureset_131', 'featureset_90', 'featureset_91', 'featureset_94']
                    break
                case 'product_17':
                    validPlatforms = ['platform_47', 'platform_48']
                    break
                case 'product_21':
                    validPlatforms = ['platform_50']
                    break
                case 'product_23':
                    validPlatforms = ['platform_52']
                    break
                case 'product_24':
                    validPlatforms = ['platform_51']
                    break
                case 'product_25':
                    validPlatforms = []
                    break
                case 'product_26':
                    validPlatforms = []
                    break
                case 'product_27':
                    validPlatforms = []
                    break
                case 'product_28':
                    validPlatforms = ['platform_63']
                    break
                case 'product_29':
                    validPlatforms = ['platform_22', 'platform_19', 'platform_46', 'platform_23', 'platform_24', 'platform_25', 'platform_26', 'platform_11', 'platform_27', 'platform_28', 'platform_21', 'platform_29', 'platform_30', 'platform_15', 'platform_31', 'platform_18', 'platform_9', 'platform_2', 'platform_4', 'platform_51', 'platform_32', 'platform_3', 'platform_49', 'platform_33', 'platform_34', 'platform_45', 'platform_8', 'platform_17', 'platform_35', 'platform_7', 'platform_50', 'platform_36', 'platform_37', 'platform_44', 'platform_38', 'platform_48', 'platform_39', 'platform_52', 'platform_47', 'platform_40', 'platform_41', 'platform_16', 'platform_20', 'platform_42', 'platform_1', 'platform_43']
                    break
                case 'product_30':
                    validPlatforms = []
                    break
                case 'product_31':
                    validPlatforms = ['platform_53']
                    break
                case 'product_32':
                    validPlatforms = ['platform_2']
                    break
                case 'product_33':
                    validPlatforms = []
                    break
                case 'product_34':
                    validPlatforms = ['platform_2']
                    break
                case 'product_35':
                    validPlatforms = ['platform_2']
                    break
                case 'product_36':
                    validPlatforms = []
                    break
                case 'product_37':
                    validPlatforms = ["platform_26", "platform_43", "platform_46", "platform_57", "platform_58", "platform_59", "platform_60", "platform_61", "platform_62"]
                    break
                default:
                    validPlatforms = []
                    validFeatureSets = []
                    break
            }

            // If new value is not null
            if (propValue !== '' && propValue !== null && propValue !== 'null') {
                await filterValidPlatformOptions(platformOptions, validPlatforms)

                if (ticketFormId == '121177' || ticketFormId == '211608') {
                    if (propValue == 'product_16') {
                        await filterValidFeatureSetOptions(featureSetOptions, validFeatureSets)
                    } else if (propValue !== 'product_37') {
                        await hideSelectedPlatformOptions(['platform_26', 'platform_43', 'platform_46', 'platform_57', 'platform_58', 'platform_59', 'platform_60', 'platform_61', 'platform_62'])
                    }
                } else if (propValue !== 'product_37') {
                    await hideSelectedPlatformOptions(['platform_26', 'platform_43', 'platform_46', 'platform_57', 'platform_58', 'platform_59', 'platform_60', 'platform_61', 'platform_62'])
                }
            }
        }
    } catch (e) { console.info(`ERROR: ${e}`) }
}

async function showAllPlatformOptions(options) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) { client.invoke(`ticketFields:custom_field_28917647.optionValues.${i}.show`) }
        resolve()
    })
}

async function hideAllPlatformOptions(options) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) { client.invoke(`ticketFields:custom_field_28917647.optionValues.${i}.hide`) }
        resolve()
    })
}

async function hideSelectedPlatformOptions(options, values) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) {
            const option = options[i].value

            if (!values.includes(option)) { client.invoke(`ticketFields:custom_field_28917647.optionValues.${i}.hide`) }
        }
        resolve()
    })
}

async function filterValidPlatformOptions(options, values) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) {
            const option = options[i].value

            if (values.includes(option)) {
                client.invoke(`ticketFields:custom_field_28917647.optionValues.${i}.show`)
            } else { client.invoke(`ticketFields:custom_field_28917647.optionValues.${i}.hide`) }
        }
        resolve()
    })
}

async function showAllIssueTypeOptions(options) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) { client.invoke(`ticketFields:custom_field_29567977.optionValues.${i}.show`) }
        resolve()
    })
}

async function hideAllIssueTypeOptions(options) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) { client.invoke(`ticketFields:custom_field_29567977.optionValues.${i}.hide`) }
        resolve()
    })
}

async function filterValidIssueTypeOptions(options, values) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) {
            const option = options[i].value

            if (values.includes(option)) {
                client.invoke(`ticketFields:custom_field_29567977.optionValues.${i}.show`)
            } else { client.invoke(`ticketFields:custom_field_29567977.optionValues.${i}.hide`) }
        }
        resolve()
    })
}

async function filterValidFeatureSetOptions(options, values) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) {
            const option = options[i].value

            if (values.includes(option)) {
                client.invoke(`ticketFields:custom_field_29193898.optionValues.${i}.show`)
            } else { client.invoke(`ticketFields:custom_field_29193898.optionValues.${i}.hide`) }
        }
        resolve()
    })
}

async function filterValidRBSCaseIssueOptions(options, values) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) {
            const option = options[i].value

            if (values.includes(option)) {
                client.invoke(`ticketFields:custom_field_114103052712.optionValues.${i}.show`)
            } else { client.invoke(`ticketFields:custom_field_114103052712.optionValues.${i}.hide`) }
        }
        resolve()
    })
}

async function filterValidModuleCategoryOptions(options, values) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) {
            const option = options[i].value

            if (values.includes(option)) {
                client.invoke(`ticketFields:custom_field_360029295891.optionValues.${i}.show`)
            } else { client.invoke(`ticketFields:custom_field_360029295891.optionValues.${i}.hide`) }
        }
        resolve()
    })
}

async function filterValidSubCategoryOptions(options, values) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) {
            const option = options[i].value

            if (values.includes(option)) {
                client.invoke(`ticketFields:custom_field_360029295931.optionValues.${i}.show`)
            } else { client.invoke(`ticketFields:custom_field_360029295931.optionValues.${i}.hide`) }
        }
        resolve()
    })
}

async function filterValidRFCModuleOptions(options, values) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) {
            const option = options[i].value

            if (values.includes(option)) {
                client.invoke(`ticketFields:custom_field_360038929832.optionValues.${i}.show`)
            } else { client.invoke(`ticketFields:custom_field_360038929832.optionValues.${i}.hide`) }
        }
        resolve()
    })
}

async function filterValidHROCategoryOptions(options, values) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) {
            const option = options[i].value

            if (values.includes(option)) {
                client.invoke(`ticketFields:custom_field_360043716591.optionValues.${i}.show`)
            } else { client.invoke(`ticketFields:custom_field_360043716591.optionValues.${i}.hide`) }
        }
        resolve()
    })
}

async function filterValidHROSubcategoryOptions(options, values) {
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i < options.length; i++) {
            const option = options[i].value

            if (values.includes(option)) {
                client.invoke(`ticketFields:custom_field_360043716611.optionValues.${i}.show`)
            } else { client.invoke(`ticketFields:custom_field_360043716611.optionValues.${i}.hide`) }
        }
        resolve()
    })
}