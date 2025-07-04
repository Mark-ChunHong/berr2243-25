// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// API Configuration
const API_BASE_URL = 'http://localhost:3000'; // Ensure this matches your backend port
let authToken = isBrowser ? localStorage.getItem('token') || '' : '';
let userRole = ''; // Will store 'admin', 'driver', or 'user' (for passenger)
let userData = {}; // Will store specific user/driver/admin data (e.g., name, email, userId)

// --- DOM Elements - Global ---
const mainHeaderTitle = document.getElementById('current-tab');
const userInitialsElement = document.getElementById('user-initials');
const userDisplayNameElement = document.getElementById('user-display-name');
const userEmailDisplayElement = document.getElementById('user-email-display');
const userRoleDisplayElement = document.getElementById('user-role-display');
const logoutBtn = document.getElementById('logout-btn');

// --- DOM Elements - Login/Registration (New in app.html) ---
const loginContainer = document.getElementById('loginContainer');
const dashboardWrapper = document.getElementById('dashboardWrapper');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const roleSelect = document.getElementById('roleSelect'); // For login form

const registerModal = document.getElementById('registerModal');
const openRegisterModalBtn = document.getElementById('openRegisterModal');
const closeRegisterModalBtn = document.querySelector('#registerModal .close-button');
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');
const regRoleSelect = document.getElementById('regRole'); // For registration form
const driverFields = document.querySelectorAll('.driver-fields');

// Registration Form Inputs
const regNameInput = document.getElementById('regName');
const regEmailInput = document.getElementById('regEmail');
const regPhoneInput = document.getElementById('regPhone');
const regPasswordInput = document.getElementById('regPassword');
const regLicenseNumberInput = document.getElementById('regLicenseNumber');
const regVehicleDetailsInput = document.getElementById('regVehicleDetails');


// --- DOM Elements - Admin specific panels and tables ---
const adminSidebar = document.getElementById('adminSidebar');
const adminPanelsGroup = document.getElementById('adminPanels'); // Group container for admin panels
const totalUsersElement = document.getElementById('total-users');
const totalRidesElement = document.getElementById('total-rides');
const totalDriversElement = document.getElementById('total-drivers');
const totalEarningsElement = document.getElementById('total-earnings');
const recentRidesTable = document.getElementById('recent-rides')?.querySelector('tbody');
const usersTable = document.getElementById('users-table')?.querySelector('tbody');
const driversTable = document.getElementById('drivers-table')?.querySelector('tbody');
const vehiclesTable = document.getElementById('vehicles-table')?.querySelector('tbody');
const ridesTable = document.getElementById('rides-table')?.querySelector('tbody');
const paymentsTable = document.getElementById('payments-table')?.querySelector('tbody');
const earningsTable = document.getElementById('earnings-table')?.querySelector('tbody');

// Admin Forms
const addUserForm = document.getElementById('addUserForm');
const addUserMessage = document.getElementById('addUserMessage');
const newUserIdInput = document.getElementById('newUserId');
const newUserNameInput = document.getElementById('newUserName');
const newUserEmailInput = document.getElementById('newUserEmail');
const newUserPhoneInput = document.getElementById('newUserPhone');
const newUserPasswordInput = document.getElementById('newUserPassword');

const addDriverForm = document.getElementById('addDriverForm');
const addDriverMessage = document.getElementById('addDriverMessage');
const newDriverIdInput = document.getElementById('newDriverId');
const newDriverNameInput = document.getElementById('newDriverName');
const newDriverEmailInput = document.getElementById('newDriverEmail');
const newDriverPhoneInput = document.getElementById('newDriverPhone');
const newDriverPasswordInput = document.getElementById('newDriverPassword');
const newDriverLicenseInput = document.getElementById('newDriverLicense');
const newDriverVehicleDetailsInput = document.getElementById('newDriverVehicleDetails');
const newDriverAvailabilityInput = document.getElementById('newDriverAvailability');

const addVehicleForm = document.getElementById('addVehicleForm');
const addVehicleMessage = document.getElementById('addVehicleMessage');
const newVehicleIdInput = document.getElementById('newVehicleId');
const newVehicleMakeInput = document.getElementById('newVehicleMake');
const newVehicleModelInput = document.getElementById('newVehicleModel');
const newVehicleYearInput = document.getElementById('newVehicleYear');
const newVehicleLicensePlateInput = document.getElementById('newVehicleLicensePlate');
const newVehicleDriverIdInput = document.getElementById('newVehicleDriverId');

const addRideForm = document.getElementById('addRideForm');
const addRideMessage = document.getElementById('addRideMessage');
const newRideIdInput = document.getElementById('newRideId');
const newRideUserIdInput = document.getElementById('newRideUserId');
const newRideDriverIdInput = document.getElementById('newRideDriverId');
const newRideVehicleIdInput = document.getElementById('newRideVehicleId');
const newRidePickupInput = document.getElementById('newRidePickup');
const newRideDropoffInput = document.getElementById('newRideDropoff');
const newRideFareInput = document.getElementById('newRideFare');
const newRideStatusInput = document.getElementById('newRideStatus');
const newRidePaymentMethodInput = document.getElementById('newRidePaymentMethod');
const newRideDateInput = document.getElementById('newRideDate');

// Admin Profile Elements
const adminProfileIdDisplay = document.getElementById('adminProfileIdDisplay');
const adminProfileNameDisplay = document.getElementById('adminProfileNameDisplay');
const adminProfileEmailDisplay = document.getElementById('adminProfileEmailDisplay');
const adminProfileNameInput = document.getElementById('adminProfileName');
const adminProfileEmailInput = document.getElementById('adminProfileEmail');
const adminProfilePasswordInput = document.getElementById('adminProfilePassword');
const adminProfileResult = document.getElementById('adminProfileResult');


// --- DOM Elements - Driver specific panels and tables ---
const driverSidebar = document.getElementById('driverSidebar');
const driverPanelsGroup = document.getElementById('driverPanels'); // Group container for driver panels
const driverAvailabilityStatus = document.getElementById('driver-availability-status');
const driverTotalRides = document.getElementById('driver-total-rides');
const driverTotalEarnings = document.getElementById('driver-total-earnings');
const driverUpcomingRidesTable = document.getElementById('driver-upcoming-rides-table')?.querySelector('tbody');
const driverAllRidesTable = document.getElementById('driver-all-rides-table')?.querySelector('tbody');
const driverEarningsTable = document.getElementById('driver-earnings-table')?.querySelector('tbody'); // Re-added for driver earnings

// Driver Rides Panel Statistics
const driverTotalRidesCount = document.getElementById('driverTotalRidesCount');
const driverCompletedRidesCount = document.getElementById('driverCompletedRidesCount');
const driverPendingRidesCount = document.getElementById('driverPendingRidesCount');

// Driver Earnings Panel Statistics
const driverTotalEarningsAmount = document.getElementById('driverTotalEarningsAmount');
const driverTodayEarnings = document.getElementById('driverTodayEarnings');
const driverWeekEarnings = document.getElementById('driverWeekEarnings');
const driverMonthEarnings = document.getElementById('driverMonthEarnings');

// Driver Profile Elements
const driverProfileIdDisplay = document.getElementById('driverProfileIdDisplay');
const driverProfileNameDisplay = document.getElementById('driverProfileNameDisplay');
const driverProfileEmailDisplay = document.getElementById('driverProfileEmailDisplay');
const driverProfilePhoneDisplay = document.getElementById('driverProfilePhoneDisplay');
const driverProfileLicenseDisplay = document.getElementById('driverProfileLicenseDisplay');
const driverProfileVehicleDetailsDisplay = document.getElementById('driverProfileVehicleDetailsDisplay');
const driverProfileAvailabilityDisplay = document.getElementById('driverProfileAvailabilityDisplay');

const driverProfileNameInput = document.getElementById('driverProfileName');
const driverProfileEmailInput = document.getElementById('driverProfileEmail');
const driverProfilePhoneInput = document.getElementById('driverProfilePhone');
const driverProfilePasswordInput = document.getElementById('driverProfilePassword');
const driverProfileLicenseNumberInput = document.getElementById('driverProfileLicenseNumber');
const driverProfileVehicleDetailsInput = document.getElementById('driverProfileVehicleDetails');
const driverProfileIsAvailableInput = document.getElementById('driverProfileIsAvailable'); // Renamed for clarity
const driverProfileResult = document.getElementById('driverProfileResult');


// --- DOM Elements - Passenger specific panels and tables ---
const passengerSidebar = document.getElementById('passengerSidebar');
const passengerPanelsGroup = document.getElementById('passengerPanels'); // Group container for passenger panels
const passengerTotalRides = document.getElementById('passenger-total-rides');
const passengerTotalSpent = document.getElementById('passenger-total-spent');
const pickupLocationInput = document.getElementById('pickupLocation');
const dropoffLocationInput = document.getElementById('dropoffLocation');
const passengerCountInput = document.getElementById('passengerCount');
const paymentMethodInput = document.getElementById('paymentMethod');
const requestRideMessage = document.getElementById('requestRideMessage');
const passengerRecentRidesTable = document.getElementById('passenger-recent-rides-table')?.querySelector('tbody');

// Passenger Profile Elements
const passengerProfileIdDisplay = document.getElementById('passengerProfileIdDisplay');
const passengerProfileNameDisplay = document.getElementById('passengerProfileNameDisplay');
const passengerProfileEmailDisplay = document.getElementById('passengerProfileEmailDisplay');
const passengerProfilePhoneDisplay = document.getElementById('passengerProfilePhoneDisplay');

const passengerProfileNameInput = document.getElementById('passengerProfileName');
const passengerProfileEmailInput = document.getElementById('passengerProfileEmail');
const passengerProfilePhoneInput = document.getElementById('passengerProfilePhone');
const passengerProfilePasswordInput = document.getElementById('passengerProfilePassword');
const passengerProfileResult = document.getElementById('passengerProfileResult');

// --- Specific Dashboard Buttons (used for initial load and attaching listeners) ---
// These are declared here and also used for attaching listeners directly by ID.
const adminDashboardBtn = document.getElementById('adminDashboardBtn');
const adminUsersBtn = document.getElementById('adminUsersBtn');
const adminDriversBtn = document.getElementById('adminDriversBtn');
const adminVehiclesBtn = document.getElementById('adminVehiclesBtn');
const adminRidesBtn = document.getElementById('adminRidesBtn');
const adminPaymentsBtn = document.getElementById('adminPaymentsBtn');
const adminEarningsBtn = document.getElementById('adminEarningsBtn');
const adminProfileBtn = document.getElementById('adminProfileBtn');

const driverDashboardBtn = document.getElementById('driverDashboardBtn');
const driverRidesBtn = document.getElementById('driverRidesBtn');
const driverEarningsBtn = document.getElementById('driverEarningsBtn');
const driverProfileBtn = document.getElementById('driverProfileBtn');

const passengerDashboardBtn = document.getElementById('passengerDashboardBtn');
const passengerRidesBtn = document.getElementById('passengerRidesBtn');
const passengerProfileBtn = document.getElementById('passengerProfileBtn');

// --- ADDED: DOM Elements for the new Accept Ride Modal ---
const acceptRideModal = document.getElementById('acceptRideModal');
const closeAcceptRideModalBtn = document.getElementById('closeAcceptRideModal');
const confirmAcceptRideBtn = document.getElementById('confirmAcceptRideBtn');
const cancelAcceptRideBtn = document.getElementById('cancelAcceptRideBtn');
const rideFareInput = document.getElementById('rideFareInput');
const acceptRideMessage = document.getElementById('acceptRideMessage');

// --- NEW: DOM Elements for the Passenger Ride Details Modal ---
const rideDetailsModal = document.getElementById('rideDetailsModal');
const closeRideDetailsModalBtn = document.getElementById('closeRideDetailsModal');
const rideDriverVehicleInfo = document.getElementById('rideDriverVehicleInfo');
const rideNoDriverInfo = document.getElementById('rideNoDriverInfo');

// --- Utility Functions ---

/**
 * Helper function to make authenticated API requests.
 * @param {string} url - The API endpoint URL (e.g., '/api/users').
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
 * @param {object} [body=null] - Request body for POST/PUT.
 * @returns {Promise<object>} - JSON response from the API.
 */
// Global variable to track logout state
let isLoggingOut = false;

async function makeRequest(url, method = 'GET', body = null) {
    // Prevent new requests if user is being logged out
    if (isLoggingOut) {
        throw new Error('User is being logged out');
    }
    
    const headers = {
        'Content-Type': 'application/json',
    };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };

    let response;
    let data;

    try {
        response = await fetch(`${API_BASE_URL}${url}`, options);
        
        // Handle 204 No Content
        if (response.status === 204) {
            return;
        }

        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // Handle non-JSON responses
            const text = await response.text();
            throw new Error(text || `Request failed with status ${response.status}`);
        }

    } catch (error) {
        // Handle network/fetch errors
        console.error('Network error in makeRequest:', error);
        if (!isLoggingOut && loginMessage) {
            displayMessage(loginMessage, 'Network error. Please try again.', false);
        }
        throw error;
    }

    // Handle HTTP errors after successful fetch
    if (!response.ok) {
        if (response.status === 401) {
            // Handle 401 (unauthorized - token expired/invalid)
            console.log('[401 Error] Unauthorized access, logging out');
            showNotification('Session expired. Please log in again.', false, 3000);
            if (loginMessage) {
                displayMessage(loginMessage, data.message || 'Session expired. Please log in again.', false);
            }
            setTimeout(() => doLogout(), 2000);
            return;
        } 
        
        if (response.status === 403) {
            // Handle 403 (forbidden) - INSTANT LOGOUT
            console.log('[403 Error] Forbidden access detected, performing instant logout');
            
            // Immediately show notification
            showNotification('Access forbidden. Logging out...', false, 1500);
            
            // Call immediate logout function
            immediateLogout();
            
            // Stop execution completely - don't throw or return anything
            return;
        }
        
        // Handle other HTTP errors
        const errorMessage = data?.message || `API Error: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
    }

    return data;
}

/**
 * Renders data into a table.
 * @param {HTMLElement} tableBody - The tbody element of the table.
 * @param {Array<object>} data - Array of objects to display.
 * @param {Array<string|object>} columns - Array of column keys or objects ({key: 'prop', formatter: fn}).
 * @param {Array<object>} [actions=null] - Array of action buttons ({label, onClick, className, condition}).
 */
function renderTable(tableBody, data, columns, actions = null) {
    console.log('[renderTable] Called with:', {
        tableBodyExists: !!tableBody,
        dataLength: data ? data.length : 0,
        columnsLength: columns ? columns.length : 0,
        actionsLength: actions ? actions.length : 0
    });
    
    if (!tableBody) {
        console.warn('Table body element not found for rendering.');
        return;
    }
    tableBody.innerHTML = ''; // Clear existing rows

    if (!data || data.length === 0) {
        const colSpan = columns.length + (actions ? 1 : 0);
        tableBody.innerHTML = `<tr><td colspan="${colSpan}">No data available.</td></tr>`;
        console.log('[renderTable] No data available, showing placeholder row');
        return;
    }

    console.log('[renderTable] Rendering', data.length, 'rows');
    data.forEach(item => {
        const row = document.createElement('tr');
        columns.forEach(colConfig => {
            const td = document.createElement('td');
            let value;
            let displayValue;

            if (typeof colConfig === 'string') {
                value = item[colConfig];
                displayValue = value;
            } else { // colConfig is an object {key: 'prop', formatter: fn}
                value = item[colConfig.key];
                displayValue = colConfig.formatter ? colConfig.formatter(value, item) : value;
            }

            // Custom formatting based on property name
            if (['rideId', 'userId', 'driverId', 'vehicleId', 'paymentId', 'earningId', 'adminId'].includes(typeof colConfig === 'string' ? colConfig : colConfig.key)) {
                td.textContent = displayValue ? String(displayValue).substring(0, 8) + '...' : 'N/A';
            } else if (typeof colConfig === 'string' && ['fare', 'amount', 'serviceFee'].includes(colConfig)) {
                td.textContent = `RM${(value || 0).toFixed(2)}`;
            } else if (typeof colConfig === 'string' && ['rideDate', 'registrationDate', 'paymentDate', 'earningDate', 'createdAt'].includes(colConfig)) {
                td.textContent = value ? new Date(value).toLocaleString() : 'N/A';
            } else if (typeof colConfig === 'string' && colConfig === 'isAvailable') {
                td.textContent = value ? 'Available' : 'Unavailable';
            } else if (typeof colConfig === 'string' && colConfig === 'passengerName') { // From aggregate lookup
                td.textContent = item.passengerName || 'N/A';
            } else if (typeof colConfig === 'string' && colConfig === 'driverName') { // From aggregate lookup
                td.textContent = item.driverName || 'N/A';
            }
            else {
                // Check if displayValue looks like HTML (starts with '<')
                if (typeof displayValue === 'string' && displayValue.trim().startsWith('<')) {
                    td.innerHTML = displayValue !== undefined ? displayValue : 'N/A';
                } else {
                    td.textContent = displayValue !== undefined ? displayValue : 'N/A';
                }
            }
            row.appendChild(td);
        });

        if (actions && actions.length > 0) {
            const actionsTd = document.createElement('td');
            actionsTd.className = 'action-buttons';
            actions.forEach(action => {
                // MODIFIED: Check for a condition before creating the button
                if (action.condition && !action.condition(item)) {
                    return; // Skip this button if the condition is not met
                }

                const button = document.createElement('button');
                button.textContent = action.label;
                if (action.className) button.classList.add(action.className);
                // Pass the primary ID of the item for actions
                const primaryId = item.rideId || item.paymentId || item.earningId || item.vehicleId || item.driverId || item.userId || item.adminId;
                button.onclick = () => action.onClick(primaryId);
                actionsTd.appendChild(button);
            });
            row.appendChild(actionsTd);
        }
        tableBody.appendChild(row);
    });
}

/**
 * Displays a message in a specific result element.
 * @param {HTMLElement} element - The DOM element to display the message in.
 * @param {string} message - The message text.
 * @param {boolean} isSuccess - True for success (green), false for error (red).
 * @param {number} [duration=3000] - Duration in ms before hiding.
 */
function displayMessage(element, message, isSuccess, duration = 3000) {
    if (element) {
        element.textContent = message;
        element.className = `message ${isSuccess ? 'success' : 'error'}`;
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.add('hidden');
            element.textContent = '';
        }, duration);
    }
}

/**
 * Hides all main content panels for a given role group.
 * @param {HTMLElement} panelGroup - The container div for the role's panels.
 */
function hideAllPanelsInGroup(panelGroup) {
    if (panelGroup) {
        panelGroup.querySelectorAll('.panel').forEach(panel => {
            panel.classList.add('hidden');
        });
    }
}

// More robust flag for panel transitions
// Using window scope to ensure it's truly global and less prone to re-initialization issues
window.isPanelTransitioning = false;
let lastPanelCallTime = 0;
const DEBOUNCE_TIME = 100; // Milliseconds to wait before allowing another panel transition

/**
 * Shows the selected panel and hides others within the same role group. Updates active sidebar button.
 * This function is designed to be called by user clicks, not during initial page load.
 * @param {string} panelId - The ID of the panel to show (e.g., 'adminDashboardPanel').
 * @param {HTMLElement} clickedButton - The button that was clicked to activate this panel.
 */
window.showPanel = function(panelId, clickedButton) {
    const now = Date.now();
    // If a panel transition is already in progress, or it's been called too recently, prevent re-entry
    if (window.isPanelTransitioning || (now - lastPanelCallTime < DEBOUNCE_TIME)) {
        console.warn(`[showPanel] Debouncing or already transitioning. Called for: ${panelId}. Current state: isPanelTransitioning=${window.isPanelTransitioning}, timeSinceLastCall=${now - lastPanelCallTime}ms`);
        return;
    }

    console.log(`[showPanel] Attempting to show panel: ${panelId}`);
    window.isPanelTransitioning = true;
    lastPanelCallTime = now;

    // Wrap the main logic in a setTimeout(0) to break the call stack
    setTimeout(() => {
        try {
            let currentPanelGroup;
            let activeSidebarElement; 
            if (userRole === 'admin') {
                currentPanelGroup = adminPanelsGroup;
                activeSidebarElement = adminSidebar;
            } else if (userRole === 'driver') {
                currentPanelGroup = driverPanelsGroup;
                activeSidebarElement = driverSidebar;
            } else if (userRole === 'user') {
                currentPanelGroup = passengerPanelsGroup;
                activeSidebarElement = passengerSidebar;
            } else {
                console.error('[showPanel] Called with unknown user role:', userRole);
                return; 
            }

            console.log(`[showPanel] User role: ${userRole}, Target panel group: ${currentPanelGroup?.id}`);

            // Hide all panels in the current group
            hideAllPanelsInGroup(currentPanelGroup);
            // Show the target panel
            const targetPanel = document.getElementById(panelId);
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
                console.log(`[showPanel] Panel "${panelId}" made visible.`);
            } else {
                console.error(`[showPanel] Target panel "${panelId}" not found.`);
            }

            // Remove active class from all sidebar buttons in the current role's sidebar
            activeSidebarElement?.querySelectorAll('.sidebar-button').forEach(btn => btn.classList.remove('active-btn'));
            
            // Add active class to the clicked button
            if (clickedButton) {
                clickedButton.classList.add('active-btn');
                console.log(`[showPanel] Button "${clickedButton.textContent.trim()}" activated.`);
            } else {
                console.warn('[showPanel] clickedButton was null or undefined.');
            }

            // Update main header title
            const headerText = clickedButton?.textContent.trim();
            if (mainHeaderTitle && headerText) {
                mainHeaderTitle.textContent = headerText;
                console.log(`[showPanel] Header updated to: "${headerText}"`);
            }

            // Call specific load functions when a panel is shown
            switch (panelId) {
                case 'adminDashboardPanel': loadAdminDashboardData(); break;
                case 'adminUsersPanel': loadUsers(); break;
                case 'adminDriversPanel': loadDrivers(); break;
                case 'adminVehiclesPanel': loadVehicles(); break;
                case 'adminRidesPanel': loadRides(); break;
                case 'adminPaymentsPanel': loadPayments(); break;
                case 'adminEarningsPanel': loadEarnings(); break;
                case 'adminProfilePanel': loadAdminProfile(); break;
                case 'driverDashboardPanel': loadDriverDashboardData(); break;
                case 'driverRidesPanel': loadDriverRides(); break;
                case 'driverEarningsPanel': loadDriverEarnings(); break;
                case 'driverProfilePanel': loadDriverProfile(); break;
                case 'passengerDashboardPanel': loadPassengerDashboardData(); break;
                case 'passengerRidesPanel': loadPassengerRides(); break;
                case 'passengerProfilePanel': loadPassengerProfile(); break;
                default: console.warn(`[showPanel] No specific load function for panel: ${panelId}`);
            }
        } catch (error) {
            console.error('[showPanel] Error during panel transition:', error);
        } finally {
            setTimeout(() => {
                window.isPanelTransitioning = false;
                console.log(`[showPanel] Transition flag reset for ${panelId}.`);
            }, DEBOUNCE_TIME + 50); 
        }
    }, 0); // Execute asynchronously
}


// --- Main Application Flow and Authentication ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[DOMContentLoaded] Event fired. Initializing app...');
    
    // Initialize payment method styling
    initPaymentMethodStyles();
    
    // Initial check for authentication status
    authToken = localStorage.getItem('token');
    const storedUserRole = localStorage.getItem('userRole'); // Get stored role
    const storedUser = localStorage.getItem('user');        if (authToken && storedUser) {
        try {
            userData = JSON.parse(storedUser);
            // Infer userRole if it's not present in localStorage or is 'undefined'
            if (!storedUserRole || storedUserRole === 'undefined') {
                if (userData.adminId) userRole = 'admin';
                else if (userData.driverId) userRole = 'driver';
                else if (userData.userId) userRole = 'user';
                // Update localStorage with the inferred role
                if (userRole) {
                    localStorage.setItem('userRole', userRole);
                }
            } else {
                userRole = storedUserRole; // Use the stored role if it's valid
            }
            
            console.log(`[DOMContentLoaded] User data found. Role: ${userRole}`);
            // Proceed only if a role could be determined
            if (userRole) {
                // Add dashboard view class to body
                document.body.classList.add('dashboard-view');
                
                loginContainer?.classList.add('hidden');
                dashboardWrapper?.classList.remove('hidden');
                // Populate user info in header
                if (userDisplayNameElement) userDisplayNameElement.textContent = userData.name || 'User Name';
                if (userEmailDisplayElement) userEmailDisplayElement.textContent = userData.email || 'user@example.com';
                // Safely access charAt after ensuring userRole is a string
                if (userRoleDisplayElement) userRoleDisplayElement.textContent = userRole ? (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : 'Unknown';
                if (userInitialsElement) userInitialsElement.textContent = (userData.name || 'U').charAt(0).toUpperCase();

                // Call loadDashboard to handle initial view setup
                await loadDashboard(); // Await loadDashboard to ensure it completes before any other actions

                // Show debug buttons after login
                if (userRole) {
                    const debugButtons = document.getElementById('debugTestButtons');
                    if (debugButtons) {
                        debugButtons.style.display = 'block';
                    }
                }

            } else {
                console.error('[DOMContentLoaded] Could not determine user role from stored data. Forcing logout.');
                doLogout();
            }

        } catch (e) {
            console.error('[DOMContentLoaded] Failed to parse user data from localStorage or invalid data:', e);
            doLogout(); // Treat as invalid session and force logout
        }
    } else {
        // No valid token or user data, show login screen
        console.log('[DOMContentLoaded] No auth token or user data found. Displaying login.');
        loginContainer?.classList.remove('hidden');
        dashboardWrapper?.classList.add('hidden');
    }

    // --- Event Listeners for Login and Registration (Moved from login.html) ---

    // Login Form Submission
    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        loginMessage?.classList.add('hidden');
        console.log('[Login Form] Submission initiated.');

        const role = roleSelect.value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Add loading state to login button
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn?.textContent;
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.classList.add('loading');
            loginBtn.textContent = 'Signing In...';
        }

        try {
            const data = await makeRequest('/api/login', 'POST', { email, password, role });

            displayMessage(loginMessage, data.message || 'Login successful! Entering dashboard...', true);
            console.log('[Login Form] Login successful. Storing token and user data.');

            // Store authentication data
            localStorage.setItem('token', data.token);
            
            // Infer and store userRole based on the presence of specific IDs in the 'user' object OR from data.role if backend returns it
            let inferredRole = data.role; // Try to get role directly from backend response first
            if (!inferredRole && data.user) { // If not directly provided, infer from user object
                if (data.user.adminId) inferredRole = 'admin';
                else if (data.user.driverId) inferredRole = 'driver';
                else if (data.user.userId) inferredRole = 'user';
            }
            
            localStorage.setItem('userRole', inferredRole); // Store the inferred/received role
            localStorage.setItem('user', JSON.stringify(data.user));

            // Update global variables
            authToken = data.token;
            userRole = inferredRole; // Use inferred role
            userData = data.user;

            // Switch to dashboard view
            // Add dashboard view class to body
            document.body.classList.add('dashboard-view');
            
            loginContainer?.classList.add('hidden');
            dashboardWrapper?.classList.remove('hidden');

            // Populate user info in header
            if (userDisplayNameElement) userDisplayNameElement.textContent = userData.name || 'User Name';
            if (userEmailDisplayElement) userEmailDisplayElement.textContent = userData.email || 'user@example.com';
            // Safely access charAt after ensuring userRole is a string
            if (userRoleDisplayElement) userRoleDisplayElement.textContent = userRole ? (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : 'Unknown';
            if (userInitialsElement) userInitialsElement.textContent = (userData.name || 'U').charAt(0).toUpperCase();

            // Call loadDashboard to handle initial view setup after successful login
            await loadDashboard(); // Await loadDashboard to ensure it completes before any other actions

            // Show debug buttons after login
            if (userRole) {
                const debugButtons = document.getElementById('debugTestButtons');
                if (debugButtons) {
                    debugButtons.style.display = 'block';
                }
            }

        } catch (error) {
            console.error('[Login Form] Network or server error during login:', error);
            displayMessage(loginMessage, error.message || 'Login failed. Please check your credentials.', false);
        } finally {
            // Reset login button state
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.classList.remove('loading');
                loginBtn.textContent = originalText || 'Login';
            }
        }
    });

    // Registration Modal Logic
    openRegisterModalBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('[Register Modal] Opening registration modal.');
        registerModal?.classList.remove('hidden'); // Show modal
        registerMessage?.classList.add('hidden'); // Clear previous messages
        registerForm?.reset(); // Clear form fields
        // Reset role to passenger and hide driver fields
        if (regRoleSelect) regRoleSelect.value = 'user';
        driverFields.forEach(field => field.classList.add('hidden'));
    });

    closeRegisterModalBtn?.addEventListener('click', () => {
        console.log('[Register Modal] Closing registration modal.');
        registerModal?.classList.add('hidden');
    });

    // Close modal if clicking outside the content
    window.addEventListener('click', (event) => {
        if (event.target == registerModal) {
            console.log('[Register Modal] Clicked outside modal, closing.');
            registerModal?.classList.add('hidden');
        }
        if (event.target == acceptRideModal) {
            hideAcceptRideModal();
        }
        // NEW: Close ride details modal if clicking outside
        if (event.target == rideDetailsModal) {
            hideRideDetailsModal();
        }
    });

    // Show/hide driver fields based on role selection in registration modal
    regRoleSelect?.addEventListener('change', () => {
        console.log(`[Register Form] Role changed to: ${regRoleSelect.value}`);
        if (regRoleSelect.value === 'driver') {
            driverFields.forEach(field => field.classList.remove('hidden'));
            regLicenseNumberInput.setAttribute('required', 'true');
            regVehicleDetailsInput.setAttribute('required', 'true');
        } else {
            driverFields.forEach(field => field.classList.add('hidden'));
            regLicenseNumberInput.removeAttribute('required');
            regVehicleDetailsInput.removeAttribute('required');
        }
    });

    // Registration Form Submission
    registerForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        registerMessage.style.display = 'none';
        console.log('[Registration Form] Submission initiated.');

        const regRole = regRoleSelect.value;
        const regName = regNameInput.value.trim();
        const regEmail = regEmailInput.value.trim();
        const regPhone = regPhoneInput.value.trim();
        const regPassword = regPasswordInput.value.trim();

        const registrationData = {
            name: regName,
            email: regEmail,
            password: regPassword,
            phone: regPhone
        };

        if (regRole === 'driver') {
            registrationData.licenseNumber = regLicenseNumberInput.value.trim();
            registrationData.vehicleDetails = regVehicleDetailsInput.value.trim();
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/register/${regRole}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData)
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(registerMessage, data.message || 'Registration successful!', true);
                console.log('[Registration Form] Registration successful.');
                registerForm.reset();
                // Automatically close modal after a delay for success
                setTimeout(() => {
                    registerModal.style.display = 'none';
                }, 2000);
            } else {
                displayMessage(registerMessage, data.message || 'Registration failed.', false);
                console.error('[Registration Form] Registration failed:', data.message);
            }
        } catch (error) {
            console.error('[Registration Form] Network or server error during registration:', error);
            displayMessage(registerMessage, 'A network error occurred. Please try again.', false);
        }
    });

    // Logout button handler
    logoutBtn?.addEventListener('click', doLogout);
    
    // Event listeners for the Accept Ride modal
    closeAcceptRideModalBtn?.addEventListener('click', hideAcceptRideModal);
    cancelAcceptRideBtn?.addEventListener('click', hideAcceptRideModal);
    confirmAcceptRideBtn?.addEventListener('click', confirmAcceptRide);

    // NEW: Event listener for the Ride Details modal
    closeRideDetailsModalBtn?.addEventListener('click', hideRideDetailsModal);


    // Attach event listeners for all sidebar buttons (using showPanel for subsequent clicks)
    // Admin Sidebar
    adminDashboardBtn?.addEventListener('click', function() { showPanel('adminDashboardPanel', this); });
    adminUsersBtn?.addEventListener('click', function() { showPanel('adminUsersPanel', this); });
    adminDriversBtn?.addEventListener('click', function() { showPanel('adminDriversPanel', this); });
    adminVehiclesBtn?.addEventListener('click', function() { showPanel('adminVehiclesPanel', this); });
    adminRidesBtn?.addEventListener('click', function() { showPanel('adminRidesPanel', this); });
    adminPaymentsBtn?.addEventListener('click', function() { showPanel('adminPaymentsPanel', this); });
    adminEarningsBtn?.addEventListener('click', function() { showPanel('adminEarningsPanel', this); });
    adminProfileBtn?.addEventListener('click', function() { showPanel('adminProfilePanel', this); });

    // Driver Sidebar
    driverDashboardBtn?.addEventListener('click', function() { showPanel('driverDashboardPanel', this); });
    driverRidesBtn?.addEventListener('click', function() { showPanel('driverRidesPanel', this); });
    driverEarningsBtn?.addEventListener('click', function() { showPanel('driverEarningsPanel', this); });
    driverProfileBtn?.addEventListener('click', function() { showPanel('driverProfilePanel', this); });

    // Passenger Sidebar
    passengerDashboardBtn?.addEventListener('click', function() { showPanel('passengerDashboardPanel', this); });
    passengerRidesBtn?.addEventListener('click', function() { showPanel('passengerRidesPanel', this); });
    passengerProfileBtn?.addEventListener('click', function() { showPanel('passengerProfilePanel', this); });

});

/**
 * Handles the logout process: clears local storage and switches to login view.
 */
function doLogout() {
    console.log('[doLogout] Starting logout process');
    
    // Set logout flag to prevent any new requests during logout
    isLoggingOut = true;
    
    // Remove dashboard view class from body
    document.body.classList.remove('dashboard-view');
    
    // Re-query DOM elements to ensure they're available
    const loginContainer = document.getElementById('loginContainer');
    const dashboardWrapper = document.getElementById('dashboardWrapper');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    console.log('[doLogout] loginContainer:', loginContainer);
    console.log('[doLogout] dashboardWrapper:', dashboardWrapper);
    
    localStorage.clear(); // Clears all stored data
    authToken = ''; // Clear in-memory token
    userRole = ''; // Clear in-memory role
    userData = {}; // Clear in-memory user data

    // Switch to login view
    if (loginContainer) {
        console.log('[doLogout] Removing hidden class from loginContainer');
        loginContainer.classList.remove('hidden');
    } else {
        console.log('[doLogout] loginContainer is null!');
    }
    
    if (dashboardWrapper) {
        console.log('[doLogout] Adding hidden class to dashboardWrapper');
        dashboardWrapper.classList.add('hidden');
    } else {
        console.log('[doLogout] dashboardWrapper is null!');
    }

    // Optionally reset login form and messages
    if (loginForm) {
        loginForm.reset();
    }
    if (loginMessage) {
        loginMessage.style.display = 'none';
    }
    
    // Hide debug buttons
    const debugButtons = document.getElementById('debugTestButtons');
    if (debugButtons) {
        debugButtons.style.display = 'none';
    }
    
    // Reset logout flag after successful logout
    setTimeout(() => {
        isLoggingOut = false;
    }, 100);
    
    console.log('[doLogout] Logout process completed');
    
    // Force page refresh as backup if DOM manipulation fails
    if (!loginContainer || !dashboardWrapper) {
        console.warn('[doLogout] DOM elements not found, forcing page reload');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

/**
 * Immediate logout function for 403 errors - bypasses normal delays
 */
function immediateLogout() {
    console.log('[immediateLogout] Performing immediate logout for 403 error');
    
    // Set logout flag immediately
    isLoggingOut = true;
    
    // Remove dashboard view class from body
    document.body.classList.remove('dashboard-view');
    
    // Clear everything immediately
    localStorage.clear();
    authToken = '';
    userRole = '';
    userData = {};
    
    // Force DOM update
    const loginContainer = document.getElementById('loginContainer');
    const dashboardWrapper = document.getElementById('dashboardWrapper');
    
    if (loginContainer) {
        loginContainer.classList.remove('hidden');
        loginContainer.style.display = 'block';
    }
    
    if (dashboardWrapper) {
        dashboardWrapper.classList.add('hidden');
        dashboardWrapper.style.display = 'none';
    }
    
    // Reset login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.reset();
    }
    
    // Hide any messages after a short delay
    setTimeout(() => {
        const loginMessage = document.getElementById('loginMessage');
        if (loginMessage) {
            loginMessage.style.display = 'none';
        }
        isLoggingOut = false;
    }, 1000);
    
    console.log('[immediateLogout] Immediate logout completed');
}

/**
 * Loads the appropriate dashboard and data based on user role.
 * This function is now solely responsible for setting up the initial dashboard view
 * by determining the role and then directly displaying the dashboard panel and loading its data.
 * It does NOT call showPanel directly to prevent recursion during initial load.
 */
async function loadDashboard() {
    console.log('[loadDashboard] Starting dashboard load for role:', userRole);
    // Hide all sidebars and panels initially
    adminSidebar?.classList.add('hidden');
    driverSidebar?.classList.add('hidden');
    passengerSidebar?.classList.add('hidden');
    adminPanelsGroup?.classList.add('hidden');
    driverPanelsGroup?.classList.add('hidden');
    passengerPanelsGroup?.classList.add('hidden');

    // Determine which sidebar and panel group to show
    let initialPanelId;
    let activeSidebarElement; // Reference to the currently active sidebar
    let initialDashboardButton; // Reference to the specific dashboard button for the role

    if (userRole === 'admin') {
        activeSidebarElement = adminSidebar;
        adminPanelsGroup?.classList.remove('hidden');
        initialPanelId = 'adminDashboardPanel';
        initialDashboardButton = adminDashboardBtn;
        await loadAdminDashboardData(); // Directly load data for initial dashboard
    } else if (userRole === 'driver') {
        activeSidebarElement = driverSidebar;
        driverPanelsGroup?.classList.remove('hidden');
        initialPanelId = 'driverDashboardPanel';
        initialDashboardButton = driverDashboardBtn;
        await loadDriverDashboardData(); // Directly load data for initial dashboard
    } else if (userRole === 'user') { // Passenger
        activeSidebarElement = passengerSidebar;
        passengerPanelsGroup?.classList.remove('hidden');
        initialPanelId = 'passengerDashboardPanel';
        initialDashboardButton = passengerDashboardBtn;
        await loadPassengerDashboardData(); // Directly load data for initial dashboard
    } else {
        console.error('[loadDashboard] Could not determine user role for loadDashboard. Forcing logout.');
        doLogout();
        return; 
    }

    // Now make the determined sidebar visible
    activeSidebarElement?.classList.remove('hidden');
    console.log(`[loadDashboard] Sidebar for ${userRole} made visible.`);

    // Directly show the initial dashboard panel and activate its corresponding button
    if (initialPanelId) {
        const initialPanel = document.getElementById(initialPanelId);
        if (initialPanel) {
            initialPanel.classList.remove('hidden');
            console.log(`[loadDashboard] Initial panel "${initialPanelId}" made visible.`);
        } else {
            console.error(`[loadDashboard] Initial panel "${initialPanelId}" not found.`);
        }

        // Remove active class from all sidebar buttons in the current role's sidebar
        activeSidebarElement?.querySelectorAll('.sidebar-button').forEach(btn => btn.classList.remove('active-btn'));
        
        // Add active class to the correct initial button
        if (initialDashboardButton) {
            initialDashboardButton.classList.add('active-btn');
            console.log(`[loadDashboard] Initial button "${initialDashboardButton.textContent.trim()}" activated.`);
        } else {
            console.warn('[loadDashboard] Initial dashboard button element not found.');
        }

        // Set the main header title
        const headerText = initialDashboardButton?.textContent.trim();
        if (mainHeaderTitle && headerText) {
            mainHeaderTitle.textContent = headerText;
            console.log(`[loadDashboard] Header updated to: "${headerText}"`);
        }

        console.log('[loadDashboard] Initial dashboard load complete.');
    } else {
        console.error('[loadDashboard] Failed to determine initial panel ID for role:', userRole);
        doLogout();
    }
}

// --- Admin Dashboard Functions ---
async function loadAdminDashboardData() {
    console.log('[loadAdminDashboardData] Loading admin dashboard data...');
    try {
        const data = await makeRequest('/api/admin/dashboard-summary');
        if (totalUsersElement) totalUsersElement.textContent = data.totalUsers;
        if (totalDriversElement) totalDriversElement.textContent = data.totalDrivers;
        if (totalRidesElement) totalRidesElement.textContent = data.totalRides;
        if (totalEarningsElement) totalEarningsElement.textContent = `RM${data.totalEarnings.toFixed(2)}`;

        renderTable(recentRidesTable, data.recentRides,
            [
                'rideId',
                { key: 'passengerName', formatter: (val, item) => item.passengerName || (item.userId ? item.userId.substring(0,8) + '...' : 'N/A') },
                { key: 'driverName', formatter: (val, item) => item.driverName || (item.driverId ? item.driverId.substring(0,8) + '...' : 'N/A') },
                'pickupLocation',
                'dropoffLocation',
                'status',
                'fare',
                'rideDate'
            ]);
            console.log('[loadAdminDashboardData] Admin dashboard data loaded successfully.');
    } catch (error) {
        console.error('[loadAdminDashboardData] Failed to load admin dashboard data:', error);
        const errorPanel = document.getElementById('adminDashboardPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to load dashboard data.', false);
    }
}

async function loadUsers() {
    console.log('[loadUsers] Loading users data...');
    try {
        const users = await makeRequest('/api/admin/users');
        
        // Update statistics
        const totalUsersElement = document.getElementById('totalUsersCount');
        if (totalUsersElement) totalUsersElement.textContent = users.length;
        
        // Calculate additional stats if needed
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const newUsersThisWeek = users.filter(user => {
            const createdAt = user.createdAt ? new Date(user.createdAt) : new Date(user.registrationDate);
            return createdAt >= oneWeekAgo;
        }).length;
        
        const activeUsersThisMonth = users.filter(user => user.totalRides > 0).length;
        
        const newUsersElement = document.getElementById('newUsersCount');
        const activeUsersElement = document.getElementById('activeUsersCount');
        if (newUsersElement) newUsersElement.textContent = newUsersThisWeek;
        if (activeUsersElement) activeUsersElement.textContent = activeUsersThisMonth;
        
        // Get fresh reference to users table
        const currentUsersTable = document.getElementById('users-table')?.querySelector('tbody');
        console.log('[loadUsers] Users table element found:', !!currentUsersTable);
        
        renderTable(currentUsersTable, users,
            ['userId', 'name', 'email', 'phone', 'registrationDate'],
            [
                { label: 'Delete', onClick: deleteUser, className: 'delete-btn' }
            ]);
            console.log('[loadUsers] Users data loaded successfully.');
    } catch (error) {
        console.error('[loadUsers] Failed to load users:', error);
        const errorPanel = document.getElementById('adminUsersPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to load user data.', false);
    }
}

window.showAddUserForm = function() {
    console.log('[showAddUserForm] Function called');
    
    // Get fresh reference to the form element
    const formElement = document.getElementById('addUserForm');
    console.log('[showAddUserForm] Form element found:', !!formElement);
    
    if (!formElement) {
        console.error('[showAddUserForm] Form element not found!');
        return;
    }
    
    // First, make sure the parent panel (adminUsersPanel) is visible
    const parentPanel = document.getElementById('adminUsersPanel');
    if (parentPanel) {
        parentPanel.classList.remove('hidden');
        console.log('[showAddUserForm] Parent panel made visible');
    }
    
    // Hide only OTHER forms in the same parent panel, not the parent panel itself
    if (parentPanel) {
        const otherForms = parentPanel.querySelectorAll('.form-container:not(#addUserForm)');
        otherForms.forEach(form => {
            form.classList.add('hidden');
            form.style.display = 'none';
        });
        console.log('[showAddUserForm] Hidden other forms in parent panel');
    }
    
    // Force the form to be visible immediately
    formElement.classList.remove('hidden');
    formElement.style.display = 'block';
    formElement.style.visibility = 'visible';
    formElement.style.opacity = '1';
    formElement.style.transform = 'none';
    
    console.log('[showAddUserForm] Form should be visible now');
    console.log('[showAddUserForm] Form classes:', formElement.className);
    console.log('[showAddUserForm] Form display:', formElement.style.display);
    
    // Clear form fields
    const nameInput = document.getElementById('newUserName');
    const emailInput = document.getElementById('newUserEmail');
    const phoneInput = document.getElementById('newUserPhone');
    const passwordInput = document.getElementById('newUserPassword');
    
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (passwordInput) passwordInput.value = '';
    
    // Clear any messages
    const messageElement = document.getElementById('addUserMessage');
    if (messageElement) messageElement.classList.add('hidden');
    
    // Focus on first field
    if (nameInput) {
        nameInput.focus();
        console.log('[showAddUserForm] Focused on name input');
    }
    
    // Update header
    const headerTitle = document.getElementById('mainHeaderTitle');
    if (headerTitle) {
        headerTitle.textContent = '➕ Add New User';
    }
    
    console.log('[showAddUserForm] Function completed');
}
window.hideAddUserForm = function() {
    console.log('[hideAddUserForm] Hiding add user form.');
    
    // Add smooth exit animation
    if (addUserForm) {
        addUserForm.style.transition = 'all 0.3s ease-in';
        addUserForm.style.opacity = '0';
        addUserForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            addUserForm.classList.add('hidden');
            addUserForm.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Return to users panel with smooth transition
    setTimeout(() => {
        showPanel('adminUsersPanel', adminUsersBtn);
        showNotification('Returned to Users list', true, 2000);
    }, 200);
}
window.addUser = async function() {
    console.log('[addUser] Attempting to add user.');
    const name = newUserNameInput.value.trim();
    const email = newUserEmailInput.value.trim();
    const phone = newUserPhoneInput.value.trim();
    const password = newUserPasswordInput.value.trim();

    if (!name || !email || !phone || !password) {
        displayMessage(addUserMessage, 'All fields are required.', false);
        // Highlight empty fields
        [newUserNameInput, newUserEmailInput, newUserPhoneInput, newUserPasswordInput].forEach(field => {
            if (field && !field.value.trim()) {
                field.style.borderColor = '#ef4444';
                field.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
                setTimeout(() => {
                    field.style.borderColor = '';
                    field.style.boxShadow = '';
                }, 3000);
            }
        });
        return;
    }

    // Show loading state on form
    const submitBtn = document.querySelector('#addUserForm button[type="submit"]');
    const originalText = submitBtn?.textContent;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '🔄 Adding User...';
        submitBtn.style.opacity = '0.7';
    }

    try {
        const response = await makeRequest('/api/admin/users', 'POST', { name, email, password, phone });
        
        // Success animation
        showNotification(`✅ User "${name}" added successfully!`, true, 4000);
        displayMessage(addUserMessage, response.message, true);
        
        console.log('[addUser] User added successfully.');
        
        // Reset form with success animation
        [newUserNameInput, newUserEmailInput, newUserPhoneInput, newUserPasswordInput].forEach((field, index) => {
            if (field) {
                setTimeout(() => {
                    field.style.borderColor = '#10b981';
                    field.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.2)';
                    setTimeout(() => {
                        field.value = '';
                        field.style.borderColor = '';
                        field.style.boxShadow = '';
                    }, 500);
                }, index * 100);
            }
        });
        
        // Smoothly update the users list in background without refresh
        setTimeout(async () => {
            try {
                const users = await makeRequest('/api/admin/users');
                const currentUsersTable = document.getElementById('users-table')?.querySelector('tbody');
                renderTable(currentUsersTable, users,
                    ['userId', 'name', 'email', 'phone', 'registrationDate'],
                    [
                        { label: 'Delete', onClick: deleteUser, className: 'delete-btn' }
                    ]);
                console.log('[addUser] Users table updated successfully.');
            } catch (error) {
                console.error('[addUser] Error updating users table:', error);
            }
        }, 1000);
        
        setTimeout(hideAddUserForm, 2000);
    } catch (error) {
        console.error('[addUser] Error adding user:', error);
        displayMessage(addUserMessage, error.message || 'Failed to add user.', false);
        showNotification('❌ Failed to add user: ' + (error.message || 'Unknown error'), false);
    } finally {
        // Reset submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }
    }
}

window.deleteUser = async function(id) {
    console.log(`[deleteUser] Attempting to delete user ID: ${id}.`);
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        console.log('[deleteUser] User deletion cancelled.');
        return;
    }
    try {
        const response = await makeRequest(`/api/admin/users/${id}`, 'DELETE');
        const errorPanel = document.getElementById('adminUsersPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, response.message, true);
        console.log(`[deleteUser] User ID: ${id} deleted successfully.`);
        loadUsers(); // Refresh the table
    } catch (error) {
        console.error(`[deleteUser] Error deleting user ID: ${id}.`, error);
        const errorPanel = document.getElementById('adminUsersPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to delete user.', false);
    }
}


async function loadDrivers() {
    console.log('[loadDrivers] Loading drivers data...');
    try {
        const drivers = await makeRequest('/api/admin/drivers');
        
        // Update statistics
        const availableDrivers = drivers.filter(driver => driver.isAvailable);
        const unavailableDrivers = drivers.filter(driver => !driver.isAvailable);
        
        updateDriverStatistics(drivers.length, availableDrivers.length, unavailableDrivers.length);
        
        // Get fresh reference to drivers table
        const currentDriversTable = document.getElementById('drivers-table')?.querySelector('tbody');
        console.log('[loadDrivers] Drivers table element found:', !!currentDriversTable);
        
        // Render table with improved columns
        renderTable(currentDriversTable, drivers,
            [
                'driverId', 
                'name', 
                {
                    key: 'contactInfo',
                    formatter: (val, item) => {
                        return `<div class="contact-info">
                            <div><strong>Email:</strong> ${item.email || 'N/A'}</div>
                            <div><strong>Phone:</strong> ${item.phone || 'N/A'}</div>
                        </div>`;
                    }
                },
                'licenseNumber', 
                'vehicleDetails', 
                {
                    key: 'isAvailable',
                    formatter: (val) => {
                        const status = val ? 'Available' : 'Unavailable';
                        const className = val ? 'status-available' : 'status-unavailable';
                        return `<span class="status-badge ${className}">${status}</span>`;
                    }
                }
            ],
            [
                { label: 'Delete', onClick: deleteDriver, className: 'delete-btn' }
            ]);
            console.log('[loadDrivers] Drivers data loaded successfully.');
    }
    catch (error) {
        console.error('[loadDrivers] Failed to load drivers:', error);
        const errorPanel = document.getElementById('adminDriversPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to load driver data.', false);
    }
}

window.showAddDriverForm = function() {
    console.log('[showAddDriverForm] Function called');
    
    // Get fresh reference to the form element
    const formElement = document.getElementById('addDriverForm');
    console.log('[showAddDriverForm] Form element found:', !!formElement);
    
    if (!formElement) {
        console.error('[showAddDriverForm] Form element not found!');
        return;
    }
    
    // First, make sure the parent panel (adminDriversPanel) is visible
    const parentPanel = document.getElementById('adminDriversPanel');
    if (parentPanel) {
        parentPanel.classList.remove('hidden');
        console.log('[showAddDriverForm] Parent panel made visible');
    }
    
    // Hide only OTHER forms in the same parent panel, not the parent panel itself
    if (parentPanel) {
        const otherForms = parentPanel.querySelectorAll('.form-container:not(#addDriverForm)');
        otherForms.forEach(form => {
            form.classList.add('hidden');
            form.style.display = 'none';
        });
        console.log('[showAddDriverForm] Hidden other forms in parent panel');
    }
    
    // Force the form to be visible immediately
    formElement.classList.remove('hidden');
    formElement.style.display = 'block';
    formElement.style.visibility = 'visible';
    formElement.style.opacity = '1';
    formElement.style.transform = 'none';
    
    console.log('[showAddDriverForm] Form should be visible now');
    console.log('[showAddDriverForm] Form classes:', formElement.className);
    console.log('[showAddDriverForm] Form display:', formElement.style.display);
    
    // Clear form fields
    const nameInput = document.getElementById('newDriverName');
    const emailInput = document.getElementById('newDriverEmail');
    const phoneInput = document.getElementById('newDriverPhone');
    const passwordInput = document.getElementById('newDriverPassword');
    const licenseInput = document.getElementById('newDriverLicense');
    const vehicleDetailsInput = document.getElementById('newDriverVehicleDetails');
    const availabilityInput = document.getElementById('newDriverAvailability');
    
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (licenseInput) licenseInput.value = '';
    if (vehicleDetailsInput) vehicleDetailsInput.value = '';
    if (availabilityInput) availabilityInput.value = 'true';
    
    // Clear any messages
    const messageElement = document.getElementById('addDriverMessage');
    if (messageElement) messageElement.classList.add('hidden');
    
    // Focus on first field
    if (nameInput) {
        nameInput.focus();
        console.log('[showAddDriverForm] Focused on name input');
    }
    
    // Update header
    const headerTitle = document.getElementById('mainHeaderTitle');
    if (headerTitle) {
        headerTitle.textContent = '🚗 Add New Driver';
    }
    
    console.log('[showAddDriverForm] Function completed');
}
window.hideAddDriverForm = function() {
    console.log('[hideAddDriverForm] Hiding add driver form.');
    
    if (addDriverForm) {
        addDriverForm.style.transition = 'all 0.3s ease-in';
        addDriverForm.style.opacity = '0';
        addDriverForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            addDriverForm.classList.add('hidden');
            addDriverForm.style.transform = 'translateY(0)';
        }, 300);
    }
    
    setTimeout(() => {
        showPanel('adminDriversPanel', adminDriversBtn);
        showNotification('Returned to Drivers list', true, 2000);
    }, 200);
}
window.addDriver = async function() {
    console.log('[addDriver] Attempting to add driver.');
    const name = newDriverNameInput.value.trim();
    const email = newDriverEmailInput.value.trim();
    const phone = newDriverPhoneInput.value.trim();
    const password = newDriverPasswordInput.value.trim();
    const licenseNumber = newDriverLicenseInput.value.trim();
    const vehicleDetails = newDriverVehicleDetailsInput.value.trim();
    const isAvailable = newDriverAvailabilityInput.value === 'true';

    if ( !name || !email || !phone || !password || !licenseNumber || !vehicleDetails) {
        displayMessage(addDriverMessage, 'All fields are required.', false);
        // Highlight empty fields
        [newDriverNameInput, newDriverEmailInput, newDriverPhoneInput, newDriverPasswordInput, newDriverLicenseInput, newDriverVehicleDetailsInput].forEach(field => {
            if (field && !field.value.trim()) {
                field.style.borderColor = '#ef4444';
                field.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
                setTimeout(() => {
                    field.style.borderColor = '';
                    field.style.boxShadow = '';
                }, 3000);
            }
        });
        return;
    }

    // Show loading state on form
    const driverSubmitBtn = document.querySelector('#addDriverForm button[type="button"]');
    const originalDriverText = driverSubmitBtn?.textContent;
    if (driverSubmitBtn) {
        driverSubmitBtn.disabled = true;
        driverSubmitBtn.textContent = '🔄 Adding Driver...';
        driverSubmitBtn.style.opacity = '0.7';
    }

    try {
        const response = await makeRequest('/api/admin/drivers', 'POST', { name, email, password, phone, licenseNumber, vehicleDetails, isAvailable });
        displayMessage(addDriverMessage, response.message, true);
        showNotification(`✅ Driver "${name}" added successfully!`, true, 4000);
        console.log('[addDriver] Driver added successfully.');
        
        // Reset form with success animation
        [newDriverNameInput, newDriverEmailInput, newDriverPhoneInput, newDriverPasswordInput, newDriverLicenseInput, newDriverVehicleDetailsInput].forEach((field, index) => {
            if (field) {
                setTimeout(() => {
                    field.style.borderColor = '#10b981';
                    field.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.2)';
                    setTimeout(() => {
                        field.value = '';
                        field.style.borderColor = '';
                        field.style.boxShadow = '';
                    }, 500);
                }, index * 100);
            }
        });
        
        // Smoothly update the drivers list in background without refresh
        setTimeout(async () => {
            try {
                await loadDrivers(); // Refresh the drivers table
                console.log('[addDriver] Drivers table updated successfully.');
            } catch (error) {
                console.error('[addDriver] Error updating drivers table:', error);
            }
        }, 800);
        
        setTimeout(hideAddDriverForm, 1500);
    } catch (error) {
        console.error('[addDriver] Error adding driver:', error);
        displayMessage(addDriverMessage, error.message || 'Failed to add driver.', false);
        showNotification('❌ Failed to add driver: ' + (error.message || 'Unknown error'), false);
    } finally {
        // Reset submit button
        if (driverSubmitBtn) {
            driverSubmitBtn.disabled = false;
            driverSubmitBtn.textContent = originalDriverText;
            driverSubmitBtn.style.opacity = '1';
        }
    }
}

window.deleteDriver = async function(id) {
    console.log(`[deleteDriver] Attempting to delete driver ID: ${id}.`);
    if (!confirm('Are you sure you want to delete this driver?')) {
        return;
    }
    try {
        const response = await makeRequest(`/api/admin/drivers/${id}`, 'DELETE');
        const errorPanel = document.getElementById('adminDriversPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, response.message, true);
        console.log(`[deleteDriver] Driver ID: ${id} deleted successfully.`);
        loadDrivers();
    } catch (error) {
        console.error(`[deleteDriver] Error deleting driver ID: ${id}.`, error);
        const errorPanel = document.getElementById('adminDriversPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to delete driver.', false);
    }
}


async function loadVehicles() {
    console.log('[loadVehicles] Loading vehicles data...');
    try {
        const vehicles = await makeRequest('/api/admin/vehicles');
        
        // Update statistics
        const assignedVehicles = vehicles.filter(vehicle => vehicle.driverId && vehicle.driverId !== null);
        const unassignedVehicles = vehicles.filter(vehicle => !vehicle.driverId || vehicle.driverId === null);
        
        const totalVehiclesElement = document.getElementById('totalVehiclesCount');
        const assignedVehiclesElement = document.getElementById('assignedVehiclesCount');
        const unassignedVehiclesElement = document.getElementById('unassignedVehiclesCount');
        
        if (totalVehiclesElement) totalVehiclesElement.textContent = vehicles.length;
        if (assignedVehiclesElement) assignedVehiclesElement.textContent = assignedVehicles.length;
        if (unassignedVehiclesElement) unassignedVehiclesElement.textContent = unassignedVehicles.length;
        
        renderTable(vehiclesTable, vehicles,
            [
                'vehicleId', 
                {
                    key: 'vehicleDetails',
                    formatter: (val, item) => {
                        return `<div class="vehicle-details">
                            <div><strong>${item.make} ${item.model}</strong></div>
                            <div>Year: ${item.year}</div>
                        </div>`;
                    }
                },
                'licensePlate', 
                {
                    key: 'assignedDriver',
                    formatter: (val, item) => {
                        if (item.driverName) {
                            return `<div class="driver-info">
                                <div><strong>${item.driverName}</strong></div>
                                <div>Phone: ${item.driverPhone || 'N/A'}</div>
                            </div>`;
                        }
                        return '<span class="status-unavailable">Unassigned</span>';
                    }
                },
                {
                    key: 'status',
                    formatter: (val, item) => {
                        if (item.driverId && item.isDriverAvailable) {
                            return '<span class="status-available">Available</span>';
                        } else if (item.driverId && !item.isDriverAvailable) {
                            return '<span class="status-unavailable">Driver Unavailable</span>';
                        } else {
                            return '<span class="status-unavailable">Unassigned</span>';
                        }
                    }
                }
            ],
            [
                { label: 'Delete', onClick: deleteVehicle, className: 'delete-btn' }
            ]);
            console.log('[loadVehicles] Vehicles data loaded successfully.');
    } catch (error) {
        console.error('[loadVehicles] Failed to load vehicles:', error);
        const errorPanel = document.getElementById('adminVehiclesPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to load vehicle data.', false);
    }
}

window.showAddVehicleForm = function() {
    console.log('[showAddVehicleForm] Function called');
    
    // Get fresh reference to the form element
    const formElement = document.getElementById('addVehicleForm');
    console.log('[showAddVehicleForm] Form element found:', !!formElement);
    
    if (!formElement) {
        console.error('[showAddVehicleForm] Form element not found!');
        return;
    }
    
    // First, make sure the parent panel (adminVehiclesPanel) is visible
    const parentPanel = document.getElementById('adminVehiclesPanel');
    if (parentPanel) {
        parentPanel.classList.remove('hidden');
        console.log('[showAddVehicleForm] Parent panel made visible');
    }
    
    // Hide only OTHER forms in the same parent panel, not the parent panel itself
    if (parentPanel) {
        const otherForms = parentPanel.querySelectorAll('.form-container:not(#addVehicleForm)');
        otherForms.forEach(form => {
            form.classList.add('hidden');
            form.style.display = 'none';
        });
        console.log('[showAddVehicleForm] Hidden other forms in parent panel');
    }
    
    // Force the form to be visible immediately
    formElement.classList.remove('hidden');
    formElement.style.display = 'block';
    formElement.style.visibility = 'visible';
    formElement.style.opacity = '1';
    formElement.style.transform = 'none';
    
    console.log('[showAddVehicleForm] Form should be visible now');
    console.log('[showAddVehicleForm] Form classes:', formElement.className);
    console.log('[showAddVehicleForm] Form display:', formElement.style.display);
    
    // Clear form fields
    const makeInput = document.getElementById('newVehicleMake');
    const modelInput = document.getElementById('newVehicleModel');
    const yearInput = document.getElementById('newVehicleYear');
    const licensePlateInput = document.getElementById('newVehicleLicensePlate');
    const driverIdInput = document.getElementById('newVehicleDriverId');
    
    if (makeInput) makeInput.value = '';
    if (modelInput) modelInput.value = '';
    if (yearInput) yearInput.value = '';
    if (licensePlateInput) licensePlateInput.value = '';
    if (driverIdInput) driverIdInput.value = '';
    
    // Clear any messages
    const messageElement = document.getElementById('addVehicleMessage');
    if (messageElement) messageElement.classList.add('hidden');
    
    // Focus on first field
    if (makeInput) {
        makeInput.focus();
        console.log('[showAddVehicleForm] Focused on make input');
    }
    
    // Update header
    const headerTitle = document.getElementById('mainHeaderTitle');
    if (headerTitle) {
        headerTitle.textContent = '🚙 Add New Vehicle';
    }
    
    console.log('[showAddVehicleForm] Function completed');
}
window.hideAddVehicleForm = function() {
    console.log('[hideAddVehicleForm] Hiding add vehicle form.');
    
    if (addVehicleForm) {
        addVehicleForm.style.transition = 'all 0.3s ease-in';
        addVehicleForm.style.opacity = '0';
        addVehicleForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            addVehicleForm.classList.add('hidden');
            addVehicleForm.style.transform = 'translateY(0)';
        }, 300);
    }
    
    setTimeout(() => {
        showPanel('adminVehiclesPanel', adminVehiclesBtn);
        showNotification('Returned to Vehicles list', true, 2000);
    }, 200);
}
window.addVehicle = async function() {
    console.log('[addVehicle] Attempting to add vehicle.');
    const make = newVehicleMakeInput.value.trim();
    const model = newVehicleModelInput.value.trim();
    const year = newVehicleYearInput.value.trim();
    const licensePlate = newVehicleLicensePlateInput.value.trim();
    const driverId = newVehicleDriverIdInput.value.trim() || null;

    if (!make || !model || !year || !licensePlate) {
        displayMessage(addVehicleMessage, 'Make, Model, Year, and License Plate are required.', false);
        // Highlight empty fields
        [newVehicleMakeInput, newVehicleModelInput, newVehicleYearInput, newVehicleLicensePlateInput].forEach(field => {
            if (field && !field.value.trim()) {
                field.style.borderColor = '#ef4444';
                field.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
                setTimeout(() => {
                    field.style.borderColor = '';
                    field.style.boxShadow = '';
                }, 3000);
            }
        });
        return;
    }

    // Show loading state on form
    const vehicleSubmitBtn = document.querySelector('#addVehicleForm button[type="button"]');
    const originalVehicleText = vehicleSubmitBtn?.textContent;
    if (vehicleSubmitBtn) {
        vehicleSubmitBtn.disabled = true;
        vehicleSubmitBtn.textContent = '🔄 Adding Vehicle...';
        vehicleSubmitBtn.style.opacity = '0.7';
    }

    try {
        const response = await makeRequest('/api/admin/vehicles', 'POST', { make, model, year, licensePlate, driverId });
        displayMessage(addVehicleMessage, response.message, true);
        showNotification(`✅ Vehicle "${make} ${model}" added successfully!`, true, 4000);
        console.log('[addVehicle] Vehicle added successfully.');
        
        // Reset form with success animation
        [newVehicleMakeInput, newVehicleModelInput, newVehicleYearInput, newVehicleLicensePlateInput, newVehicleDriverIdInput].forEach((field, index) => {
            if (field) {
                setTimeout(() => {
                    field.style.borderColor = '#10b981';
                    field.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.2)';
                    setTimeout(() => {
                        field.value = '';
                        field.style.borderColor = '';
                        field.style.boxShadow = '';
                    }, 500);
                }, index * 100);
            }
        });
        
        // Smoothly update the vehicles list in background without refresh
        setTimeout(async () => {
            try {
                await loadVehicles(); // Refresh the vehicles table
                console.log('[addVehicle] Vehicles table updated successfully.');
            } catch (error) {
                console.error('[addVehicle] Error updating vehicles table:', error);
            }
        }, 800);
        
        setTimeout(hideAddVehicleForm, 1500);
    } catch (error) {
        console.error('[addVehicle] Error adding vehicle:', error);
        displayMessage(addVehicleMessage, error.message || 'Failed to add vehicle.', false);
        showNotification('❌ Failed to add vehicle: ' + (error.message || 'Unknown error'), false);
    } finally {
        // Reset submit button
        if (vehicleSubmitBtn) {
            vehicleSubmitBtn.disabled = false;
            vehicleSubmitBtn.textContent = originalVehicleText;
            vehicleSubmitBtn.style.opacity = '1';
        }
    }
}

window.deleteVehicle = async function(id) {
    console.log(`[deleteVehicle] Attempting to delete vehicle ID: ${id}.`);
    if (!confirm('Are you sure you want to delete this vehicle?')) {
        return;
    }
    try {
        const response = await makeRequest(`/api/admin/vehicles/${id}`, 'DELETE');
        const errorPanel = document.getElementById('adminVehiclesPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, response.message, true);
        console.log(`[deleteVehicle] Vehicle ID: ${id} deleted successfully.`);
        loadVehicles();
    } catch (error) {
        console.error(`[deleteVehicle] Error deleting vehicle ID: ${id}.`, error);
        const errorPanel = document.getElementById('adminVehiclesPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to delete vehicle.', false);
    }
}


async function loadRides() {
    console.log('[loadRides] Loading rides data...');
    try {
        const rides = await makeRequest('/api/admin/rides');
        
        // Update statistics
        const completedRides = rides.filter(ride => ride.status === 'completed');
        const pendingRides = rides.filter(ride => ride.status === 'pending');
        const inProgressRides = rides.filter(ride => ride.status === 'in_progress');
        
        updateRideStatistics(rides.length, completedRides.length, pendingRides.length, inProgressRides.length);
        
        // Render table with improved columns
        renderTable(ridesTable, rides,
            [
                'rideId', 
                'passengerName', 
                'driverName', 
                {
                    key: 'tripDetails',
                    formatter: (val, item) => {
                        return `<div class="trip-details">
                            <div><strong>From:</strong> ${item.pickupLocation || 'N/A'}</div>
                            <div><strong>To:</strong> ${item.dropoffLocation || 'N/A'}</div>
                        </div>`;
                    }
                },
                {
                    key: 'fare',
                    formatter: (val) => {
                        return val != null ? `RM${parseFloat(val).toFixed(2)}` : 'N/A';
                    }
                },
                {
                    key: 'status',
                    formatter: (val) => {
                        const statusClass = val ? `status-${val.toLowerCase().replace('_', '-')}` : 'status-unknown';
                        return `<span class="status-badge ${statusClass}">${val || 'Unknown'}</span>`;
                    }
                },
                {
                    key: 'rideDate',
                    formatter: (val) => {
                        return val ? new Date(val).toLocaleDateString() + ' ' + new Date(val).toLocaleTimeString() : 'N/A';
                    }
                }
            ],
            [
                { label: 'Delete', onClick: deleteRide, className: 'delete-btn' }
            ]);
            console.log('[loadRides] Rides data loaded successfully.');
    } catch (error) {
        console.error('[loadRides] Failed to load rides:', error);
        const errorPanel = document.getElementById('adminRidesPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to load ride data.', false);
    }
}
window.showAddRideForm = function() {
    console.log('[showAddRideForm] Function called');
    
    // Get fresh reference to the form element
    const formElement = document.getElementById('addRideForm');
    console.log('[showAddRideForm] Form element found:', !!formElement);
    
    if (!formElement) {
        console.error('[showAddRideForm] Form element not found!');
        return;
    }
    
    // First, make sure the parent panel (adminRidesPanel) is visible
    const parentPanel = document.getElementById('adminRidesPanel');
    if (parentPanel) {
        parentPanel.classList.remove('hidden');
        console.log('[showAddRideForm] Parent panel made visible');
    }
    
    // Hide only OTHER forms in the same parent panel, not the parent panel itself
    if (parentPanel) {
        const otherForms = parentPanel.querySelectorAll('.form-container:not(#addRideForm)');
        otherForms.forEach(form => {
            form.classList.add('hidden');
            form.style.display = 'none';
        });
        console.log('[showAddRideForm] Hidden other forms in parent panel');
    }
    
    // Force the form to be visible immediately
    formElement.classList.remove('hidden');
    formElement.style.display = 'block';
    formElement.style.visibility = 'visible';
    formElement.style.opacity = '1';
    formElement.style.transform = 'none';
    
    console.log('[showAddRideForm] Form should be visible now');
    console.log('[showAddRideForm] Form classes:', formElement.className);
    console.log('[showAddRideForm] Form display:', formElement.style.display);
    
    // Clear form fields and set defaults
    const userIdInput = document.getElementById('newRideUserId');
    const driverIdInput = document.getElementById('newRideDriverId');
    const vehicleIdInput = document.getElementById('newRideVehicleId');
    const pickupInput = document.getElementById('newRidePickup');
    const dropoffInput = document.getElementById('newRideDropoff');
    const fareInput = document.getElementById('newRideFare');
    const statusInput = document.getElementById('newRideStatus');
    const paymentMethodInput = document.getElementById('newRidePaymentMethod');
    const dateInput = document.getElementById('newRideDate');
    
    if (userIdInput) userIdInput.value = '';
    if (driverIdInput) driverIdInput.value = '';
    if (vehicleIdInput) vehicleIdInput.value = '';
    if (pickupInput) pickupInput.value = '';
    if (dropoffInput) dropoffInput.value = '';
    if (fareInput) fareInput.value = '';
    if (statusInput) statusInput.value = 'pending';
    if (paymentMethodInput) paymentMethodInput.value = '';
    if (dateInput) dateInput.valueAsDate = new Date();
    
    // Clear any messages
    const messageElement = document.getElementById('addRideMessage');
    if (messageElement) messageElement.classList.add('hidden');
    
    // Focus on first field
    if (userIdInput) {
        userIdInput.focus();
        console.log('[showAddRideForm] Focused on user ID input');
    }
    
    // Update header
    const headerTitle = document.getElementById('mainHeaderTitle');
    if (headerTitle) {
        headerTitle.textContent = '🚕 Add New Ride';
    }
    
    console.log('[showAddRideForm] Function completed');
}
window.hideAddRideForm = function() {
    console.log('[hideAddRideForm] Hiding add ride form.');
    
    if (addRideForm) {
        addRideForm.style.transition = 'all 0.3s ease-in';
        addRideForm.style.opacity = '0';
        addRideForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            addRideForm.classList.add('hidden');
            addRideForm.style.transform = 'translateY(0)';
        }, 300);
    }
    
    setTimeout(() => {
        showPanel('adminRidesPanel', adminRidesBtn);
        showNotification('Returned to Rides list', true, 2000);
    }, 200);
}
window.addRide = async function() {
    console.log('[addRide] Attempting to add ride.');
    const userId = newRideUserIdInput.value.trim();
    const driverId = newRideDriverIdInput.value.trim();
    const vehicleId = newRideVehicleIdInput.value.trim() || null;
    const pickupLocation = newRidePickupInput.value.trim();
    const dropoffLocation = newRideDropoffInput.value.trim();
    const fare = parseFloat(newRideFareInput.value.trim());
    const status = newRideStatusInput.value.trim();
    const paymentMethod = newRidePaymentMethodInput.value.trim() || null;
    const rideDate = newRideDateInput.value ? new Date(newRideDateInput.value) : new Date();


    if (!userId || !driverId || !pickupLocation || !dropoffLocation || isNaN(fare) || !status) {
        displayMessage(addRideMessage, 'Required fields: User ID, Driver ID, Pickup, Dropoff, Fare, Status.', false);
        // Highlight empty fields
        [newRideUserIdInput, newRideDriverIdInput, newRidePickupInput, newRideDropoffInput, newRideFareInput].forEach(field => {
            if (field && (!field.value.trim() || (field === newRideFareInput && isNaN(parseFloat(field.value.trim()))))) {
                field.style.borderColor = '#ef4444';
                field.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
                setTimeout(() => {
                    field.style.borderColor = '';
                    field.style.boxShadow = '';
                }, 3000);
            }
        });
        return;
    }

    // Show loading state on form
    const rideSubmitBtn = document.querySelector('#addRideForm button[type="button"]');
    const originalRideText = rideSubmitBtn?.textContent;
    if (rideSubmitBtn) {
        rideSubmitBtn.disabled = true;
        rideSubmitBtn.textContent = '🔄 Adding Ride...';
        rideSubmitBtn.style.opacity = '0.7';
    }

    try {
        const response = await makeRequest('/api/admin/rides', 'POST', { userId, driverId, vehicleId, pickupLocation, dropoffLocation, fare, status, paymentMethod, rideDate });
        displayMessage(addRideMessage, response.message, true);
        showNotification(`✅ Ride from "${pickupLocation}" to "${dropoffLocation}" added successfully!`, true, 4000);
        console.log('[addRide] Ride added successfully.');
        
        // Reset form with success animation
        [newRideUserIdInput, newRideDriverIdInput, newRideVehicleIdInput, newRidePickupInput, newRideDropoffInput, newRideFareInput, newRidePaymentMethodInput].forEach((field, index) => {
            if (field) {
                setTimeout(() => {
                    field.style.borderColor = '#10b981';
                    field.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.2)';
                    setTimeout(() => {
                        field.value = '';
                        field.style.borderColor = '';
                        field.style.boxShadow = '';
                    }, 500);
                }, index * 100);
            }
        });
        
        // Smoothly update the rides list in background without refresh
        setTimeout(async () => {
            try {
                await loadRides(); // Refresh the rides table
                await loadAdminDashboardData(); // Update dashboard stats as well
                console.log('[addRide] Rides table and dashboard updated successfully.');
            } catch (error) {
                console.error('[addRide] Error updating rides table:', error);
            }
        }, 800);
        
        setTimeout(hideAddRideForm, 1500);
    } catch (error) {
        console.error('[addRide] Error adding ride:', error);
        displayMessage(addRideMessage, error.message || 'Failed to add ride.', false);
        showNotification('❌ Failed to add ride: ' + (error.message || 'Unknown error'), false);
    } finally {
        // Reset submit button
        if (rideSubmitBtn) {
            rideSubmitBtn.disabled = false;
            rideSubmitBtn.textContent = originalRideText;
            rideSubmitBtn.style.opacity = '1';
        }
    }
}
window.deleteRide = async function(id) {
    console.log(`[deleteRide] Attempting to delete ride ID: ${id}.`);
    if (!confirm('Are you sure you want to delete this ride?')) {
        return;
    }
    try {
        const response = await makeRequest(`/api/admin/rides/${id}`, 'DELETE');
        const errorPanel = document.getElementById('adminRidesPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, response.message, true);
        console.log(`[deleteRide] Ride ID: ${id} deleted successfully.`);
        loadRides();
        loadAdminDashboardData(); // Update dashboard stats
    } catch (error) {
        console.error(`[deleteRide] Error deleting ride ID: ${id}.`, error);
        const errorPanel = document.getElementById('adminRidesPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to delete ride.', false);
    }
}


async function loadPayments() {
    console.log('[loadPayments] Loading payments data...');
    try {
        const payments = await makeRequest('/api/admin/payments');
        
        // Update statistics
        const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        const today = new Date().toDateString();
        const todayPayments = payments.filter(payment => {
            const paymentDate = payment.paymentDate ? new Date(payment.paymentDate).toDateString() : 
                                payment.createdAt ? new Date(payment.createdAt).toDateString() : '';
            return paymentDate === today;
        });
        
        const totalPaymentsCountElement = document.getElementById('totalPaymentsCount');
        const totalPaymentsAmountElement = document.getElementById('totalPaymentsAmount');
        const todayPaymentsCountElement = document.getElementById('todayPaymentsCount');
        
        if (totalPaymentsCountElement) totalPaymentsCountElement.textContent = payments.length;
        if (totalPaymentsAmountElement) totalPaymentsAmountElement.textContent = `RM${totalAmount.toFixed(2)}`;
        if (todayPaymentsCountElement) todayPaymentsCountElement.textContent = todayPayments.length;
        
        renderTable(paymentsTable, payments,
            [
                'paymentId', 
                'rideId', 
                'userId', 
                {
                    key: 'amount',
                    formatter: (val) => `RM${(val || 0).toFixed(2)}`
                },
                'paymentMethod', 
                'paymentStatus', 
                {
                    key: 'paymentDate',
                    formatter: (val) => val ? new Date(val).toLocaleDateString() : 'N/A'
                }
            ]);
            console.log('[loadPayments] Payments data loaded successfully.');
    } catch (error) {
        console.error('[loadPayments] Failed to load payments:', error);
        const errorPanel = document.getElementById('adminPaymentsPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to load payment data.', false);
    }
}

async function loadEarnings() {
    console.log('[loadEarnings] Loading earnings data...');
    try {
        const earnings = await makeRequest('/api/admin/earnings');
        
        // Update statistics
        const totalEarnings = earnings.reduce((sum, earning) => sum + (earning.amount || 0), 0);
        const totalServiceFees = earnings.reduce((sum, earning) => sum + (earning.serviceFee || 0), 0);
        const today = new Date().toDateString();
        const todayEarnings = earnings.filter(earning => {
            const earningDate = earning.earningDate ? new Date(earning.earningDate).toDateString() : '';
            return earningDate === today;
        });
        const todayEarningsAmount = todayEarnings.reduce((sum, earning) => sum + (earning.amount || 0), 0);
        
        const totalEarningsCountElement = document.getElementById('totalEarningsCount');
        const totalEarningsAmountElement = document.getElementById('totalEarningsAmount');
        const totalServiceFeesElement = document.getElementById('totalServiceFees');
        const todayEarningsAmountElement = document.getElementById('todayEarningsAmount');
        
        if (totalEarningsCountElement) totalEarningsCountElement.textContent = earnings.length;
        if (totalEarningsAmountElement) totalEarningsAmountElement.textContent = `RM${totalEarnings.toFixed(2)}`;
        if (totalServiceFeesElement) totalServiceFeesElement.textContent = `RM${totalServiceFees.toFixed(2)}`;
        if (todayEarningsAmountElement) todayEarningsAmountElement.textContent = `RM${todayEarningsAmount.toFixed(2)}`;
        
        renderTable(earningsTable, earnings,
            [
                'earningId', 
                {
                    key: 'driverName',
                    formatter: (val, item) => item.driverName || (item.driverId ? item.driverId.substring(0,8) + '...' : 'N/A')
                },
                'rideId', 
                {
                    key: 'amount',
                    formatter: (val) => `RM${(val || 0).toFixed(2)}`
                },
                {
                    key: 'serviceFee',
                    formatter: (val) => `RM${(val || 0).toFixed(2)}`
                },
                {
                    key: 'earningDate',
                    formatter: (val) => val ? new Date(val).toLocaleDateString() : 'N/A'
                }
            ]);
            console.log('[loadEarnings] Earnings data loaded successfully.');
    }
    catch (error) {
        console.error('[loadEarnings] Error fetching earnings:', error);
        const errorPanel = document.getElementById('adminEarningsPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to load earning data.', false);
    }
}

async function loadAdminProfile() {
    console.log('[loadAdminProfile] Loading admin profile...');
    try {
        // Use userData that's already loaded during login
        if (!userData || !userData.adminId) {
            displayMessage(adminProfileResult, 'Admin data not found. Please log in again.', false);
            return;
        }

        // Try to get fresh admin profile data from the server
        let adminData;
        try {
            // Try the admin profile endpoint first
            adminData = await makeRequest('/api/admin/profile');
        } catch (error) {
            console.log('[loadAdminProfile] Admin profile endpoint not available, using stored userData');
            // Fallback to using stored userData
            adminData = userData;
        }

        if (adminData) {
            // Update the display elements
            if (adminProfileIdDisplay) adminProfileIdDisplay.textContent = adminData.adminId || adminData.id || 'N/A';
            if (adminProfileNameDisplay) adminProfileNameDisplay.textContent = adminData.name || 'N/A';
            if (adminProfileEmailDisplay) adminProfileEmailDisplay.textContent = adminData.email || 'N/A';

            // Update the input fields for editing
            if (adminProfileNameInput) adminProfileNameInput.value = adminData.name || '';
            if (adminProfileEmailInput) adminProfileEmailInput.value = adminData.email || '';
            if (adminProfilePasswordInput) adminProfilePasswordInput.value = ''; // Never pre-fill passwords
            
            console.log('[loadAdminProfile] Admin profile loaded successfully.');
        } else {
            displayMessage(adminProfileResult, 'No admin data available.', false);
        }
    } catch (error) {
        console.error('[loadAdminProfile] Error loading admin profile:', error);
        displayMessage(adminProfileResult, error.message || 'Failed to load admin profile.', false);
    }
}

window.updateAdminProfile = async function() {
    console.log('[updateAdminProfile] Attempting to update admin profile.');
    
    if (!userData || !userData.adminId) {
        displayMessage(adminProfileResult, 'Admin data not found. Please log in again.', false);
        return;
    }

    const name = adminProfileNameInput.value.trim();
    const email = adminProfileEmailInput.value.trim();
    const password = adminProfilePasswordInput.value.trim();

    if (!name || !email) {
        displayMessage(adminProfileResult, 'Name and email are required.', false);
        return;
    }

    const updateData = { name, email };
    if (password) {
        updateData.password = password;
    }

    try {
        let response;
        try {
            // Try the admin profile update endpoint first
            response = await makeRequest('/api/admin/profile', 'PUT', updateData);
        } catch (error) {
            console.log('[updateAdminProfile] Admin profile endpoint not available, trying alternative endpoint');
            // Fallback to admin users endpoint with adminId
            response = await makeRequest(`/api/admin/profile/${userData.adminId}`, 'PUT', updateData);
        }
        
        displayMessage(adminProfileResult, response.message || 'Profile updated successfully!', true);
        console.log('[updateAdminProfile] Profile updated successfully.');
        
        // Update local storage and global userData
        userData.name = name;
        userData.email = email;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update header display elements
        if (userDisplayNameElement) userDisplayNameElement.textContent = name;
        if (userEmailDisplayElement) userEmailDisplayElement.textContent = email;
        if (userInitialsElement) userInitialsElement.textContent = name.charAt(0).toUpperCase();

        // Reload profile display to reflect changes
        loadAdminProfile();
        
        // Clear password field for security
        if (adminProfilePasswordInput) adminProfilePasswordInput.value = '';
        
    } catch (error) {
        console.error('[updateAdminProfile] Error updating admin profile:', error);
        displayMessage(adminProfileResult, error.message || 'Failed to update profile.', false);
    }
}

// --- Missing Admin Helper Functions ---

/**
 * Updates driver statistics display elements
 */
function updateDriverStatistics(totalDrivers, availableDrivers, unavailableDrivers) {
    // Update statistics in the drivers panel if elements exist
    const totalDriversElement = document.getElementById('totalDriversCount');
    const availableDriversElement = document.getElementById('availableDriversCount');
    const unavailableDriversElement = document.getElementById('unavailableDriversCount');
    
    if (totalDriversElement) totalDriversElement.textContent = totalDrivers;
    if (availableDriversElement) availableDriversElement.textContent = availableDrivers;
    if (unavailableDriversElement) unavailableDriversElement.textContent = unavailableDrivers;
    
    console.log(`[updateDriverStatistics] Updated: Total=${totalDrivers}, Available=${availableDrivers}, Unavailable=${unavailableDrivers}`);
}

/**
 * Updates ride statistics display elements
 */
function updateRideStatistics(totalRides, completedRides, pendingRides, inProgressRides) {
    // Update statistics in the rides panel if elements exist
    const totalRidesStatsElement = document.getElementById('totalRidesCount');
    const completedRidesElement = document.getElementById('completedRidesCount');
    const pendingRidesElement = document.getElementById('pendingRidesCount');
    const inProgressRidesElement = document.getElementById('inProgressRidesCount');
    
    if (totalRidesStatsElement) totalRidesStatsElement.textContent = totalRides;
    if (completedRidesElement) completedRidesElement.textContent = completedRides;
    if (pendingRidesElement) pendingRidesElement.textContent = pendingRides;
    if (inProgressRidesElement) inProgressRidesElement.textContent = inProgressRides;
    
    console.log(`[updateRideStatistics] Updated: Total=${totalRides}, Completed=${completedRides}, Pending=${pendingRides}, InProgress=${inProgressRides}`);
}

/**
 * Delete vehicle function
 */
window.deleteVehicle = async function(id) {
    console.log(`[deleteVehicle] Attempting to delete vehicle ID: ${id}.`);
    if (!confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
        console.log('[deleteVehicle] Vehicle deletion cancelled.');
        return;
    }
    try {
        const response = await makeRequest(`/api/admin/vehicles/${id}`, 'DELETE');
        showNotification('✅ Vehicle deleted successfully!', true, 3000);
        console.log(`[deleteVehicle] Vehicle ID: ${id} deleted successfully.`);
        loadVehicles(); // Refresh the table
    } catch (error) {
        console.error(`[deleteVehicle] Error deleting vehicle ID: ${id}.`, error);
        showNotification('❌ Failed to delete vehicle: ' + (error.message || 'Unknown error'), false, 4000);
    }
}

/**
 * Delete ride function
 */
window.deleteRide = async function(id) {
    console.log(`[deleteRide] Attempting to delete ride ID: ${id}.`);
    if (!confirm('Are you sure you want to delete this ride? This action cannot be undone.')) {
        console.log('[deleteRide] Ride deletion cancelled.');
        return;
    }
    try {
        const response = await makeRequest(`/api/admin/rides/${id}`, 'DELETE');
        showNotification('✅ Ride deleted successfully!', true, 3000);
        console.log(`[deleteRide] Ride ID: ${id} deleted successfully.`);
        loadRides(); // Refresh the table
        loadAdminDashboardData(); // Update dashboard stats as well
    } catch (error) {
        console.error(`[deleteRide] Error deleting ride ID: ${id}.`, error);
        showNotification('❌ Failed to delete ride: ' + (error.message || 'Unknown error'), false, 4000);
    }
}

/**
 * Add vehicle function
 */
window.addVehicle = async function() {
    console.log('[addVehicle] Attempting to add vehicle.');
    const make = newVehicleMakeInput.value.trim();
    const model = newVehicleModelInput.value.trim();
    const year = newVehicleYearInput.value.trim();
    const licensePlate = newVehicleLicensePlateInput.value.trim();
    const driverId = newVehicleDriverIdInput.value.trim();

    if (!make || !model || !year || !licensePlate) {
        displayMessage(addVehicleMessage, 'Make, model, year, and license plate are required.', false);
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#addVehicleForm button[type="submit"]');
    const originalText = submitBtn?.textContent;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '🔄 Adding Vehicle...';
        submitBtn.style.opacity = '0.7';
    }

    try {
        const response = await makeRequest('/api/admin/vehicles', 'POST', { 
            make, 
            model, 
            year: parseInt(year), 
            licensePlate, 
            driverId: driverId || null 
        });
        
        showNotification(`✅ Vehicle "${make} ${model}" added successfully!`, true, 4000);
        displayMessage(addVehicleMessage, response.message, true);
        
        console.log('[addVehicle] Vehicle added successfully.');
        
        // Reset form
        newVehicleMakeInput.value = '';
        newVehicleModelInput.value = '';
        newVehicleYearInput.value = '';
        newVehicleLicensePlateInput.value = '';
        newVehicleDriverIdInput.value = '';
        
        setTimeout(() => {
            loadVehicles(); // Refresh the vehicles list
        }, 1000);
        
        setTimeout(hideAddVehicleForm, 2000);
    } catch (error) {
        console.error('[addVehicle] Error adding vehicle:', error);
        displayMessage(addVehicleMessage, error.message || 'Failed to add vehicle.', false);
        showNotification('❌ Failed to add vehicle: ' + (error.message || 'Unknown error'), false);
    } finally {
        // Reset submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }
    }
}

/**
 * Hide add vehicle form
 */
window.hideAddVehicleForm = function() {
    console.log('[hideAddVehicleForm] Hiding add vehicle form.');
    
    if (addVehicleForm) {
        addVehicleForm.style.transition = 'all 0.3s ease-in';
        addVehicleForm.style.opacity = '0';
        addVehicleForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            addVehicleForm.classList.add('hidden');
            addVehicleForm.style.transform = 'translateY(0)';
        }, 300);
    }
    
    setTimeout(() => {
        showPanel('adminVehiclesPanel', adminVehiclesBtn);
        showNotification('Returned to Vehicles list', true, 2000);
    }, 200);
}

/**
 * Add ride function
 */
window.addRide = async function() {
    console.log('[addRide] Attempting to add ride.');
    const userId = newRideUserIdInput.value.trim();
    const driverId = newRideDriverIdInput.value.trim();
    const vehicleId = newRideVehicleIdInput.value.trim();
    const pickupLocation = newRidePickupInput.value.trim();
    const dropoffLocation = newRideDropoffInput.value.trim();
    const fare = newRideFareInput.value.trim();
    const status = newRideStatusInput.value;
    const paymentMethod = newRidePaymentMethodInput.value;
    const rideDate = newRideDateInput.value;

    if (!userId || !driverId || !pickupLocation || !dropoffLocation || !fare || !status) {
        displayMessage(addRideMessage, 'User ID, Driver ID, pickup location, dropoff location, fare, and status are required.', false);
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#addRideForm button[type="submit"]');
    const originalText = submitBtn?.textContent;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '🔄 Adding Ride...';
        submitBtn.style.opacity = '0.7';
    }

    try {
        const response = await makeRequest('/api/admin/rides', 'POST', { 
            userId, 
            driverId, 
            vehicleId: vehicleId || null,
            pickupLocation, 
            dropoffLocation, 
            fare: parseFloat(fare), 
            status,
            rideDate: rideDate || null,
            paymentMethod: paymentMethod || null
        });
        
        showNotification(`✅ Ride from "${pickupLocation}" to "${dropoffLocation}" added successfully!`, true, 4000);
        displayMessage(addRideMessage, response.message, true);
        
        console.log('[addRide] Ride added successfully.');
        
        // Reset form
        newRideUserIdInput.value = '';
        newRideDriverIdInput.value = '';
        newRideVehicleIdInput.value = '';
        newRidePickupInput.value = '';
        newRideDropoffInput.value = '';
        newRideFareInput.value = '';
        newRideStatusInput.value = 'pending';
        newRidePaymentMethodInput.value = 'cash';
        newRideDateInput.value = '';
        
        setTimeout(() => {
            loadRides(); // Refresh the rides list
            loadAdminDashboardData(); // Update dashboard stats
        }, 1000);
        
        setTimeout(hideAddRideForm, 2000);
    } catch (error) {
        console.error('[addRide] Error adding ride:', error);
        displayMessage(addRideMessage, error.message || 'Failed to add ride.', false);
        showNotification('❌ Failed to add ride: ' + (error.message || 'Unknown error'), false);
    } finally {
        // Reset submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }
    }
}

/**
 * Hide add ride form
 */
window.hideAddRideForm = function() {
    console.log('[hideAddRideForm] Hiding add ride form.');
    
    if (addRideForm) {
        addRideForm.style.transition = 'all 0.3s ease-in';
        addRideForm.style.opacity = '0';
        addRideForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            addRideForm.classList.add('hidden');
            addRideForm.style.transform = 'translateY(0)';
        }, 300);
    }
    
    setTimeout(() => {
        showPanel('adminRidesPanel', adminRidesBtn);
        showNotification('Returned to Rides list', true, 2000);
    }, 200);
}

/**
 * Show notification helper function
 */
function showNotification(message, isSuccess = true, duration = 3000) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            max-width: 300px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    // Set message and style
    notification.textContent = message;
    notification.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
    
    // Auto hide after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
    }, duration);
}


// --- Driver Dashboard Functions ---
async function loadDriverDashboardData() {
    console.log('[loadDriverDashboardData] Loading driver dashboard data...');
    try {
        const driverId = userData.driverId || userData.id; // Ensure driverId is from userData
        if (!driverId) {
             console.error("[loadDriverDashboardData] Driver ID not found in user data.");
             const errorPanel = document.getElementById('driverDashboardPanel');
             if(errorPanel) displayMessage(errorPanel, 'Driver data not available.', false);
             return;
        }

        // Use the new dashboard summary endpoint
        const dashboardData = await makeRequest(`/api/driver/dashboard-summary/${driverId}`);
        
        if (dashboardData) {
            // Update availability display
            updateAvailabilityDisplay(dashboardData.isAvailable);
            
            // Update dashboard overview statistics
            if (driverTotalRides) driverTotalRides.textContent = dashboardData.completedRides;
            if (driverTotalEarnings) driverTotalEarnings.textContent = `RM${dashboardData.totalEarnings.toFixed(2)}`;
            const driverPendingRides = document.getElementById('driver-pending-rides');
            if (driverPendingRides) driverPendingRides.textContent = dashboardData.pendingRides;
            
            // Update rides panel statistics (if they exist)
            if (driverTotalRidesCount) driverTotalRidesCount.textContent = dashboardData.totalRides;
            if (driverCompletedRidesCount) driverCompletedRidesCount.textContent = dashboardData.completedRides;
            if (driverPendingRidesCount) driverPendingRidesCount.textContent = dashboardData.pendingRides;
            
            // Update earnings panel statistics (if they exist)
            if (driverTotalEarningsAmount) driverTotalEarningsAmount.textContent = `RM${dashboardData.totalEarnings.toFixed(2)}`;
            if (driverTodayEarnings) driverTodayEarnings.textContent = `RM${dashboardData.todayEarnings.toFixed(2)}`;
            if (driverWeekEarnings) driverWeekEarnings.textContent = `RM${dashboardData.weekEarnings.toFixed(2)}`;
            if (driverMonthEarnings) driverMonthEarnings.textContent = `RM${dashboardData.monthEarnings.toFixed(2)}`;
            
            // Update local storage to keep data synchronized
            userData.isAvailable = dashboardData.isAvailable;
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Display recent pending rides
            renderTable(driverUpcomingRidesTable, dashboardData.recentPendingRides,
                [
                    { key: 'passengerName', formatter: (val, item) => item.passengerName || 'N/A' },
                    'pickupLocation',
                    'dropoffLocation',
                    'status',
                    'rideDate'
                ],
                [
                    { label: 'Accept', onClick: showAcceptRideModal, className: 'action-btn' },
                    { label: 'Decline', onClick: declineRide, className: 'delete-btn' }
                ]
            );
        }
        
        console.log('[loadDriverDashboardData] Driver dashboard data loaded successfully.');

    } catch (error) {
        console.error('[loadDriverDashboardData] Error loading driver dashboard data:', error);
        
        // Check if this is a 403 error that's already being handled by makeRequest
        if (error.message && error.message.includes('Access denied')) {
            console.log('[loadDriverDashboardData] Access denied error handled by makeRequest');
            return; // Don't show additional notifications
        }
        
        // Show popup notification for other errors
        showNotification(error.message || 'Failed to load driver dashboard data.', false, 5000);
        
        // Also show panel message for non-403 errors
        const errorPanel = document.getElementById('driverDashboardPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to load driver dashboard data.', false);
    }
}

/**
 * Shows the modal to accept a ride and stores the ride ID.
 * @param {string} rideId - The ID of the ride to be accepted.
 */
function showAcceptRideModal(rideId) {
    console.log(`[showAcceptRideModal] Opening modal for Ride ID: ${rideId}`);
    // Store the rideId on the modal itself for later retrieval
    acceptRideModal.dataset.rideId = rideId;
    
    // Reset form state
    rideFareInput.value = '';
    acceptRideMessage.classList.add('hidden');
    
    // Display the modal
    acceptRideModal?.classList.remove('hidden');
}

/**
 * Hides the accept ride modal.
 */
function hideAcceptRideModal() {
    console.log('[hideAcceptRideModal] Closing modal.');
    acceptRideModal?.classList.add('hidden');
    delete acceptRideModal.dataset.rideId; // Clean up stored rideId
}

/**
 * Confirms the ride acceptance, sets the fare, and updates the ride status.
 */
async function confirmAcceptRide() {
    const rideId = acceptRideModal.dataset.rideId;
    const fare = parseFloat(rideFareInput.value);

    if (!rideId) {
        console.error('[confirmAcceptRide] No rideId found.');
        return;
    }

    if (isNaN(fare) || fare <= 0) {
        displayMessage(acceptRideMessage, 'Please enter a valid, positive fare.', false);
        return;
    }

    console.log(`[confirmAcceptRide] Accepting Ride ID: ${rideId} with Fare: $${fare}`);

    try {
        // Use the general ride update endpoint.
        await makeRequest(`/api/admin/rides/${rideId}`, 'PUT', {
            fare: fare,
            status: 'accepted'
        });
        
        // Show success notification popup
        showNotification(`Ride accepted successfully! Fare set to RM${fare.toFixed(2)}`, true);
        console.log('[confirmAcceptRide] Ride accepted successfully.');
        
        hideAcceptRideModal();
        loadDriverDashboardData(); // Refresh the dashboard to remove the ride from the pending list
        loadDriverRides(); // Also refresh the "All Rides" list if the user navigates there

    } catch (error) {
        console.error('[confirmAcceptRide] Error accepting ride:', error);
        showNotification(error.message || 'Failed to accept the ride.', false);
    }
}

/**
 * Declines a pending ride.
 * @param {string} rideId The ID of the ride to decline.
 */
async function declineRide(rideId) {
    if (!confirm(`Are you sure you want to decline this ride?`)) {
        return;
    }
    
    console.log(`[declineRide] Declining ride ID: ${rideId}`);
    try {
        // Use the general ride update endpoint with a 'declined' status.
        await makeRequest(`/api/admin/rides/${rideId}`, 'PUT', { status: 'declined' });
        
        // Show success notification popup
        showNotification('Ride declined successfully.', true);
        console.log(`[declineRide] Ride ${rideId} declined successfully.`);

        loadDriverDashboardData(); // Refresh the list of pending rides
        loadDriverRides(); // Also refresh the list of all rides

    } catch (error) {
        console.error('[declineRide] Error declining ride:', error);
        showNotification(error.message || 'Failed to decline ride.', false);
    }
}

// NEW: Function for a driver to complete a ride
async function completeRide(rideId) {
    if (!confirm('Are you sure you want to mark this ride as complete?')) {
        return;
    }

    console.log(`[completeRide] Completing ride ID: ${rideId}`);
    try {
        // Use the unified ride update endpoint
        await makeRequest(`/api/admin/rides/${rideId}`, 'PUT', { status: 'completed' });
        
        // Show success notification popup
        showNotification('Ride completed successfully!', true);

        // Refresh data on both dashboard and rides page
        loadDriverRides();
        loadDriverDashboardData();
        loadDriverEarnings(); // Refresh earnings as a new record was created

    } catch (error) {
        console.error('[completeRide] Error completing ride:', error);
        showNotification(error.message || 'Failed to complete ride.', false);
    }
}


async function loadDriverRides() {
    console.log('[loadDriverRides] Loading driver rides data...');
    try {
        const driverId = userData.driverId || userData.id;
        if (!driverId) return;

        const driverRides = await makeRequest(`/api/driver/rides/${driverId}`);
        
        // Calculate statistics
        const totalRides = driverRides.length;
        const completedRides = driverRides.filter(ride => ride.status === 'completed').length;
        const pendingRides = driverRides.filter(ride => ride.status === 'pending').length;
        
        // Update statistics displays
        if (driverTotalRidesCount) driverTotalRidesCount.textContent = totalRides;
        if (driverCompletedRidesCount) driverCompletedRidesCount.textContent = completedRides;
        if (driverPendingRidesCount) driverPendingRidesCount.textContent = pendingRides;
        
        renderTable(driverAllRidesTable, driverRides,
            [
                'rideId',
                { key: 'passengerName', formatter: (val, item) => item.passengerName || 'N/A' },
                'pickupLocation',
                'dropoffLocation',
                'fare',
                'status',
                'rideDate'
            ],
            [
                { label: 'View', onClick: showRideDetailsModal, className: 'view-btn' },
                { 
                    label: 'Complete', 
                    onClick: completeRide, 
                    className: 'complete-btn',
                    // Conditionally show this button only for 'accepted' or 'in_progress' rides
                    condition: (item) => ['accepted', 'in_progress'].includes(item.status)
                }
            ]
        );
        console.log('[loadDriverRides] Driver rides data loaded successfully.');
    } catch (error) {
        console.error('[loadDriverRides] Error loading driver rides:', error);
        
        // Check if this is a 403 error that's already being handled by makeRequest
        if (error.message && error.message.includes('Access denied')) {
            console.log('[loadDriverRides] Access denied error handled by makeRequest');
            return; // Don't show additional notifications
        }
        
        // Show popup notification for other errors
        showNotification(error.message || 'Failed to load driver ride data.', false, 5000);
        
        // Also show message in panel for non-403 errors
        const errorPanel = document.getElementById('driverRidesPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to load driver ride data.', false);
    }
}

async function loadDriverEarnings() {
    console.log('[loadDriverEarnings] Loading driver earnings data...');
    try {
        const driverId = userData.driverId || userData.id;
        if (!driverId) {
            const errorPanel = document.getElementById('driverEarningsPanel');
            if(errorPanel) displayMessage(errorPanel, 'Driver ID not found in user data.', false);
            return;
        }
        const earnings = await makeRequest(`/api/driver/earnings/${driverId}`);
        
        // Calculate statistics
        const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
        
        // Calculate today's earnings
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEarnings = earnings.filter(earning => {
            const earningDate = new Date(earning.earningDate);
            return earningDate >= todayStart;
        }).reduce((sum, earning) => sum + earning.amount, 0);
        
        // Calculate this week's earnings
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of this week (Sunday)
        weekStart.setHours(0, 0, 0, 0);
        const weekEarnings = earnings.filter(earning => {
            const earningDate = new Date(earning.earningDate);
            return earningDate >= weekStart;
        }).reduce((sum, earning) => sum + earning.amount, 0);
        
        // Calculate this month's earnings
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEarnings = earnings.filter(earning => {
            const earningDate = new Date(earning.earningDate);
            return earningDate >= monthStart;
        }).reduce((sum, earning) => sum + earning.amount, 0);
        
        // Update statistics displays
        if (driverTotalEarningsAmount) driverTotalEarningsAmount.textContent = `RM${totalEarnings.toFixed(2)}`;
        if (driverTodayEarnings) driverTodayEarnings.textContent = `RM${todayEarnings.toFixed(2)}`;
        if (driverWeekEarnings) driverWeekEarnings.textContent = `RM${weekEarnings.toFixed(2)}`;
        if (driverMonthEarnings) driverMonthEarnings.textContent = `RM${monthEarnings.toFixed(2)}`;
        
        renderTable(driverEarningsTable, earnings,
            ['earningId', 'rideId', 'amount', 'serviceFee', 'earningDate']);
        console.log('[loadDriverEarnings] Driver earnings data loaded successfully.');
    } catch (error) {
        console.error('[loadDriverEarnings] Error fetching driver earnings:', error);
        const errorPanel = document.getElementById('driverEarningsPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to load driver earnings data.', false);
    }
}

async function loadDriverProfile() {
    console.log('[loadDriverProfile] Loading driver profile...');
    try {
        const driverId = userData.driverId || userData.id;
        if (!driverId) {
            displayMessage(driverProfileResult, 'Driver ID not found in user data.', false);
            return;
        }
        const driverData = await makeRequest(`/api/driver/profile/${driverId}`);
        if (driverData) {
            driverProfileIdDisplay.textContent = driverData.driverId;
            driverProfileNameDisplay.textContent = driverData.name;
            driverProfileEmailDisplay.textContent = driverData.email;
            driverProfilePhoneDisplay.textContent = driverData.phone || 'N/A';
            driverProfileLicenseDisplay.textContent = driverData.licenseNumber || 'N/A';
            driverProfileVehicleDetailsDisplay.textContent = driverData.vehicleDetails || 'N/A';
            driverProfileAvailabilityDisplay.textContent = driverData.isAvailable ? 'Available' : 'Unavailable';

            driverProfileNameInput.value = driverData.name;
            driverProfileEmailInput.value = driverData.email;
            driverProfilePhoneInput.value = driverData.phone || '';
            driverProfilePasswordInput.value = ''; // Never pre-fill passwords
            driverProfileLicenseNumberInput.value = driverData.licenseNumber || '';
            driverProfileVehicleDetailsInput.value = driverData.vehicleDetails || '';
            driverProfileIsAvailableInput.value = String(driverData.isAvailable); // Select expects string
            console.log('[loadDriverProfile] Driver profile loaded successfully.');
        }
    } catch (error) {
        console.error('[loadDriverProfile] Error loading driver profile:', error);
        displayMessage(driverProfileResult, error.message || 'Failed to load driver profile.', false);
    }
}

window.updateDriverProfile = async function() {
    console.log('[updateDriverProfile] Attempting to update driver profile.');
    const driverId = userData.driverId || userData.id;
    if (!driverId) {
        displayMessage(driverProfileResult, 'Driver ID not found for update.', false);
        return;
    }

    const name = driverProfileNameInput.value.trim();
    const email = driverProfileEmailInput.value.trim();
    const phone = driverProfilePhoneInput.value.trim();
    const password = driverProfilePasswordInput.value.trim();
    const licenseNumber = driverProfileLicenseNumberInput.value.trim();
    const vehicleDetails = driverProfileVehicleDetailsInput.value.trim();
    const isAvailable = driverProfileIsAvailableInput.value === 'true'; // Convert string to boolean

    const updateData = { name, email, phone, licenseNumber, vehicleDetails, isAvailable };
    if (password) {
        updateData.password = password;
    }

    try {
        const response = await makeRequest(`/api/driver/profile/${driverId}`, 'PUT', updateData);
        displayMessage(driverProfileResult, response.message || 'Profile updated successfully!', true);
        console.log('[updateDriverProfile] Driver profile updated successfully.');
        
        // Update local storage userData and re-load profile display
        userData.name = name;
        userData.email = email;
        // Also update other details that might be stored
        Object.assign(userData, { phone, licenseNumber, vehicleDetails, isAvailable });
        localStorage.setItem('user', JSON.stringify(userData));
        
        userDisplayNameElement.textContent = name;
        userEmailDisplayElement.textContent = email;
        userInitialsElement.textContent = name.charAt(0).toUpperCase();

        loadDriverProfile(); // Reload to update displayed info
        loadDriverDashboardData(); // Update dashboard availability card
        driverProfilePasswordInput.value = ''; // Clear password field
    } catch (error) {
        console.error('[updateDriverProfile] Error updating driver profile:', error);
        displayMessage(driverProfileResult, error.message || 'Failed to update profile.', false);
    }
}

/**
 * Toggle driver availability status
 */
window.toggleAvailability = async function() {
    console.log('[toggleAvailability] Toggling driver availability...');
    
    const driverId = userData.driverId || userData.id;
    if (!driverId) {
        console.error('[toggleAvailability] Driver ID not found in user data.');
        showNotification('❌ Driver data not available. Please log in again.', false, 4000);
        return;
    }

    // Get current availability status from the displayed element or userData
    let isCurrentlyAvailable = false;
    if (driverAvailabilityStatus?.textContent === 'Available') {
        isCurrentlyAvailable = true;
    } else if (userData.isAvailable !== undefined) {
        isCurrentlyAvailable = userData.isAvailable;
    }
    
    const newAvailability = !isCurrentlyAvailable;

    // Show loading state on the toggle button
    const toggleBtn = document.querySelector('.toggle-availability-btn');
    const originalText = toggleBtn?.innerHTML;
    if (toggleBtn) {
        toggleBtn.disabled = true;
        toggleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        toggleBtn.style.opacity = '0.7';
    }

    try {
        // Update availability via API
        const response = await makeRequest(`/api/driver/profile/${driverId}`, 'PUT', { 
            isAvailable: newAvailability 
        });

        // Update the displayed status
        updateAvailabilityDisplay(newAvailability);

        // Update local storage
        userData.isAvailable = newAvailability;
        localStorage.setItem('user', JSON.stringify(userData));

        // Show success notification
        const statusText = newAvailability ? 'Available' : 'Unavailable';
        showNotification(`✅ Status updated to: ${statusText}`, true, 3000);
        
        console.log(`[toggleAvailability] Driver availability updated to: ${newAvailability}`);

        // Refresh profile display if on profile panel
        const profilePanel = document.getElementById('driverProfilePanel');
        if (profilePanel && !profilePanel.classList.contains('hidden')) {
            loadDriverProfile();
        }

    } catch (error) {
        console.error('[toggleAvailability] Error updating availability:', error);
        showNotification('❌ Failed to update availability: ' + (error.message || 'Unknown error'), false, 4000);
    } finally {
        // Reset toggle button
        if (toggleBtn) {
            toggleBtn.disabled = false;
            toggleBtn.style.opacity = '1';
            if (!toggleBtn.innerHTML.includes('Go ')) {
                toggleBtn.innerHTML = originalText;
            }
        }
    }
}

/**
 * Update availability display elements
 */
function updateAvailabilityDisplay(isAvailable) {
    // Update availability status display
    if (driverAvailabilityStatus) {
        driverAvailabilityStatus.textContent = isAvailable ? 'Available' : 'Unavailable';
        driverAvailabilityStatus.className = `status-badge ${isAvailable ? 'status-available' : 'status-unavailable'}`;
    }
    
    // Update toggle button state
    const toggleBtn = document.querySelector('.toggle-availability-btn');
    if (toggleBtn) {
        toggleBtn.innerHTML = `<i class="fas fa-power-off"></i> ${isAvailable ? 'Go Offline' : 'Go Online'}`;
        toggleBtn.className = `toggle-availability-btn ${isAvailable ? 'btn-warning' : 'btn-success'}`;
    }
}


// --- Passenger Dashboard Functions ---

// NEW: Show ride details modal
async function showRideDetailsModal(rideId) {
    console.log(`[showRideDetailsModal] Fetching details for ride ID: ${rideId}`);
    try {
        // Ensure payment method styles are initialized
        initPaymentMethodStyles();
        
        // Use the appropriate endpoint based on user role
        let data;
        if (userRole === 'driver') {
            // Use driver endpoint to get ride details
            data = await makeRequest(`/api/driver/ride-details/${rideId}`);
            // Fall back to common endpoint if driver-specific endpoint fails
            if (!data) {
                data = await makeRequest(`/api/common/ride-details/${rideId}`);
            }
        } else {
            // Default to passenger endpoint
            data = await makeRequest(`/api/passenger/ride-details/${rideId}`);
        }
        
        // Populate ride info
        document.getElementById('detailsRideId').textContent = data.rideId ? data.rideId.substring(0, 8) + '...' : 'N/A';
        document.getElementById('detailsRideStatus').textContent = data.status || 'N/A';
        document.getElementById('detailsRideDate').textContent = data.rideDate ? new Date(data.rideDate).toLocaleString() : 'N/A';
        document.getElementById('detailsRideFare').textContent = `RM${(data.fare || 0).toFixed(2)}`;
        
        // Format and highlight payment method
        const paymentMethodElement = document.getElementById('detailsRidePaymentMethod');
        const formattedPaymentMethod = formatPaymentMethod(data.paymentMethod) || 'N/A';
        paymentMethodElement.textContent = formattedPaymentMethod;
        
        // Add payment method badge styling
        if (data.paymentMethod) {
            paymentMethodElement.className = 'payment-badge ' + data.paymentMethod.replace('_', '-');
        } else {
            paymentMethodElement.className = '';
        }
        
        document.getElementById('detailsRidePickup').textContent = data.pickupLocation || 'N/A';
        document.getElementById('detailsRideDropoff').textContent = data.dropoffLocation || 'N/A';

        // Check if driver/vehicle info is available
        if (data.driverName) {
            rideDriverVehicleInfo.classList.remove('hidden');
            rideNoDriverInfo.classList.add('hidden');
            
            // Populate driver info
            document.getElementById('detailsDriverName').textContent = data.driverName || 'N/A';
            document.getElementById('detailsDriverPhone').textContent = data.driverPhone || 'N/A';

            // Populate vehicle info
            document.getElementById('detailsVehicleMake').textContent = data.vehicleMake || 'N/A';
            document.getElementById('detailsVehicleModel').textContent = data.vehicleModel || 'N/A';
            document.getElementById('detailsVehicleLicensePlate').textContent = data.vehicleLicensePlate || 'N/A';
        } else {
            // Hide driver/vehicle sections and show the message
            rideDriverVehicleInfo.classList.add('hidden');
            rideNoDriverInfo.classList.remove('hidden');
        }

        // Show the modal
        rideDetailsModal?.classList.remove('hidden');

    } catch (error) {
        console.error('[showRideDetailsModal] Error fetching ride details:', error);
        
        // Handle specific error types
        if (error.message && error.message.includes('Access denied')) {
            // Don't show additional notifications as makeRequest already handled the 403 error
            console.log('[showRideDetailsModal] Access denied error handled by makeRequest');
        } else if (error.message && error.message.includes('Ride not found')) {
            showNotification('Ride not found.', false, 3000);
        } else {
            showNotification(error.message || 'Failed to load ride details.', false, 5000);
            
            // Only show panel message for non-403 errors
            const errorPanel = userRole === 'driver' 
                ? document.getElementById('driverRidesPanel')
                : document.getElementById('passengerRidesPanel');
            
            if (errorPanel) {
                displayMessage(errorPanel, error.message || 'Failed to load ride details.', false);
            }
        }
    }
}

// NEW: Hide ride details modal
function hideRideDetailsModal() {
    rideDetailsModal?.classList.add('hidden');
}


async function loadPassengerDashboardData() {
    console.log('[loadPassengerDashboardData] Loading passenger dashboard data...');
    try {
        const userId = userData.userId || userData.id;
        if (!userId) {
            const errorPanel = document.getElementById('passengerDashboardPanel');
            if(errorPanel) displayMessage(errorPanel, 'User ID not found in user data.', false);
            return;
        }

        const rides = await makeRequest(`/api/passenger/rides/${userId}`);
        const completedRides = rides.filter(ride => ride.status === 'completed');
        const pendingRides = rides.filter(ride => ride.status === 'pending');
        const totalSpent = completedRides.filter(ride => typeof ride.fare === 'number')
                                        .reduce((sum, ride) => sum + ride.fare, 0);

        // Update dashboard statistics
        const passengerTotalRides = document.getElementById('passenger-total-rides');
        const passengerTotalSpent = document.getElementById('passenger-total-spent');
        const passengerPendingRides = document.getElementById('passenger-pending-rides');
        const passengerCompletedRides = document.getElementById('passenger-completed-rides');
        
        if (passengerTotalRides) passengerTotalRides.textContent = rides.length;
        if (passengerTotalSpent) passengerTotalSpent.textContent = `RM${totalSpent.toFixed(2)}`;
        if (passengerPendingRides) passengerPendingRides.textContent = pendingRides.length;
        if (passengerCompletedRides) passengerCompletedRides.textContent = completedRides.length;

        // Display recent rides for passenger with enhanced formatting
        const passengerRecentRidesTable = document.getElementById('passenger-recent-rides-table')?.querySelector('tbody');
        renderTable(passengerRecentRidesTable, rides.sort((a, b) => new Date(b.rideDate) - new Date(a.rideDate)).slice(0, 5),
            [
                { 
                    key: 'rideId', 
                    formatter: (val) => val ? val.substring(0, 8) + '...' : 'N/A'
                },
                { 
                    key: 'driverName', 
                    formatter: (val, item) => {
                        if (item.status === 'pending') return '<span class="status-badge status-pending">Not assigned</span>';
                        if (item.driverName) return item.driverName;
                        if (item.driverId) return `Driver ${item.driverId.substring(0,8)}...`;
                        return 'N/A';
                    }
                },
                {
                    key: 'tripDetails',
                    formatter: (val, item) => {
                        return `<div class="trip-details">
                            <div class="pickup"><i class="fas fa-map-marker-alt text-success"></i> ${item.pickupLocation}</div>
                            <div class="dropoff"><i class="fas fa-flag text-danger"></i> ${item.dropoffLocation}</div>
                        </div>`;
                    }
                },
                { 
                    key: 'fare', 
                    formatter: (val) => {
                        if (val && val > 0) return `RM${parseFloat(val).toFixed(2)}`;
                        return '<span class="text-muted">To be set</span>';
                    }
                },
                {
                    key: 'status',
                    formatter: (val) => {
                        const statusClass = val ? `status-${val.replace(' ', '-')}` : 'status-unknown';
                        return `<span class="status-badge ${statusClass}">${val || 'Unknown'}</span>`;
                    }
                },
                {
                    key: 'rideDate',
                    formatter: (val) => val ? new Date(val).toLocaleDateString() : 'N/A'
                }
            ],
            [
                { label: 'View', onClick: showRideDetailsModal, className: 'view-btn' }
            ]
        );
        console.log('[loadPassengerDashboardData] Passenger dashboard data loaded successfully.');

    } catch (error) {
        console.error('[loadPassengerDashboardData] Error loading passenger dashboard data:', error);
        const errorPanel = document.getElementById('passengerDashboardPanel');
        if(errorPanel) displayMessage(errorPanel.querySelector('.message') || errorPanel, error.message || 'Failed to load passenger dashboard data.', false);
    }
}
async function loadPassengerRides() {
    console.log('[loadPassengerRides] Loading passenger rides data...');
    try {
        const userId = userData.userId || userData.id;
        if (!userId) return;

        const passengerRides = await makeRequest(`/api/passenger/rides/${userId}`);
        
        // Calculate statistics for rides panel
        const pendingRides = passengerRides.filter(ride => ride.status === 'pending');
        const inProgressRides = passengerRides.filter(ride => ride.status === 'in_progress');
        const completedRides = passengerRides.filter(ride => ride.status === 'completed');
        const cancelledRides = passengerRides.filter(ride => ride.status === 'cancelled' || ride.status === 'declined');

        // Update statistics
        const passengerPendingRidesCount = document.getElementById('passengerPendingRidesCount');
        const passengerInProgressRidesCount = document.getElementById('passengerInProgressRidesCount');
        const passengerCompletedRidesCount = document.getElementById('passengerCompletedRidesCount');
        const passengerCancelledRidesCount = document.getElementById('passengerCancelledRidesCount');
        
        if (passengerPendingRidesCount) passengerPendingRidesCount.textContent = pendingRides.length;
        if (passengerInProgressRidesCount) passengerInProgressRidesCount.textContent = inProgressRides.length;
        if (passengerCompletedRidesCount) passengerCompletedRidesCount.textContent = completedRides.length;
        if (passengerCancelledRidesCount) passengerCancelledRidesCount.textContent = cancelledRides.length;

        // Get reference to the unified rides table
        const allRidesTable = document.getElementById('passenger-all-rides-table')?.querySelector('tbody');

        // Columns for all rides (unified format)
        const rideColumns = [
            { 
                key: 'driverInfo', 
                formatter: (val, item) => {
                    if (item.status === 'pending') {
                        return '<span class="status-badge status-pending">Waiting for driver</span>';
                    }
                    if (item.driverName) {
                        return `<div class="contact-info">
                            <div><strong>${item.driverName}</strong></div>
                            <div><a href="tel:${item.driverPhone || ''}">${item.driverPhone || 'Phone unavailable'}</a></div>
                        </div>`;
                    }
                    if (item.driverId) {
                        return `Driver ${item.driverId.substring(0, 8)}...`;
                    }
                    return '<span class="text-muted">Driver info unavailable</span>';
                }
            },
            {
                key: 'tripDetails',
                formatter: (val, item) => {
                    return `<div class="trip-details">
                        <div class="pickup"><i class="fas fa-map-marker-alt text-success"></i> ${item.pickupLocation}</div>
                        <div class="dropoff"><i class="fas fa-flag text-danger"></i> ${item.dropoffLocation}</div>
                    </div>`;
                }
            },
            { 
                key: 'paymentMethod', 
                formatter: (val, item) => {
                    return `<span class="payment-badge ${val?.replace('_', '-') || ''}">${formatPaymentMethod(val)}</span>`;
                }
            },
            { 
                key: 'fare', 
                formatter: (val, item) => {
                    if (val != null && val !== undefined && val > 0) {
                        return `RM${parseFloat(val).toFixed(2)}`;
                    }
                    return '<span class="text-muted">To be set</span>';
                }
            },
            { 
                key: 'status',
                formatter: (val) => {
                    return `<span class="status-badge status-${val?.replace(' ', '-') || 'unknown'}">${val || 'Unknown'}</span>`;
                }
            },
            {
                key: 'rideDate',
                formatter: (val) => val ? new Date(val).toLocaleDateString() : 'N/A'
            }
        ];

        const actions = [
            { label: 'View Details', onClick: showRideDetailsModal, className: 'view-btn' }
        ];

        // Render unified table with all rides (sorted by date, newest first)
        const sortedRides = passengerRides.sort((a, b) => new Date(b.rideDate) - new Date(a.rideDate));
        renderTable(allRidesTable, sortedRides, rideColumns, actions);

        console.log('[loadPassengerRides] Passenger rides data loaded and displayed in unified table.');
    } catch (error) {
        console.error('[loadPassengerRides] Error loading passenger rides:', error);
        const errorPanel = document.getElementById('passengerRidesPanel');
        if (errorPanel) {
            displayMessage(
                errorPanel.querySelector('.message') || errorPanel,
                error.message || 'Failed to load passenger ride data.',
                false
            );
        }
    }
}
async function loadPassengerProfile() {
    console.log('[loadPassengerProfile] Loading passenger profile...');
    try {
        const userId = userData.userId || userData.id;
        if (!userId) {
            displayMessage(passengerProfileResult, 'User ID not found in user data.', false);
            return;
        }
        const passengerData = await makeRequest(`/api/passenger/profile/${userId}`);
        if (passengerData) {
            passengerProfileIdDisplay.textContent = passengerData.userId;
            passengerProfileNameDisplay.textContent = passengerData.name;
            passengerProfileEmailDisplay.textContent = passengerData.email;
            passengerProfilePhoneDisplay.textContent = passengerData.phone || 'N/A';

            passengerProfileNameInput.value = passengerData.name;
            passengerProfileEmailInput.value = passengerData.email;
            passengerProfilePhoneInput.value = passengerData.phone || '';
            passengerProfilePasswordInput.value = ''; // Never pre-fill passwords
            console.log('[loadPassengerProfile] Passenger profile loaded successfully.');
        }
    } catch (error) {
        console.error('[loadPassengerProfile] Error loading passenger profile:', error);
        displayMessage(passengerProfileResult, error.message || 'Failed to load passenger profile.', false);
    }
}

window.updatePassengerProfile = async function() {
    console.log('[updatePassengerProfile] Attempting to update passenger profile.');
    const userId = userData.userId || userData.id;
    if (!userId) {
        displayMessage(passengerProfileResult, 'User ID not found for update.', false);
        return;
    }

    const name = passengerProfileNameInput.value.trim();
    const email = passengerProfileEmailInput.value.trim();
    const phone = passengerProfilePhoneInput.value.trim();
    const password = passengerProfilePasswordInput.value.trim();

    const updateData = { name, email, phone };
    if (password) {
        updateData.password = password;
    }

    try {
        const response = await makeRequest(`/api/passenger/profile/${userId}`, 'PUT', updateData);
        displayMessage(passengerProfileResult, response.message || 'Profile updated successfully!', true);
        console.log('[updatePassengerProfile] Passenger profile updated successfully.');
        
        // Update local storage userData and re-load profile display
        userData.name = name;
        userData.email = email;
        userData.phone = phone;
        localStorage.setItem('user', JSON.stringify(userData));
        
        userDisplayNameElement.textContent = name;
        userEmailDisplayElement.textContent = email;
        userInitialsElement.textContent = name.charAt(0).toUpperCase();

        loadPassengerProfile(); // Reload to update displayed info
        passengerProfilePasswordInput.value = ''; // Clear password field
    } catch (error) {
        console.error('[updatePassengerProfile] Error updating passenger profile:', error);
        displayMessage(passengerProfileResult, error.message || 'Failed to update profile.', false);
    }
}

window.requestRide = async function() {
    console.log('[requestRide] Attempting to request ride.');
    const userId = userData.userId || userData.id;
    if (!userId) {
        displayMessage(requestRideMessage, 'User not logged in.', false);
        return;
    }

    const pickupLocation = pickupLocationInput.value.trim();
    const dropoffLocation = dropoffLocationInput.value.trim();
    const passengerCount = passengerCountInput.value;
    const paymentMethod = paymentMethodInput.value;

    if (!pickupLocation || !dropoffLocation || !passengerCount || !paymentMethod) {
        displayMessage(requestRideMessage, 'Pickup location, dropoff location, passenger count, and payment method are required.', false);
        
        // Highlight empty fields with red border
        [
            { field: pickupLocationInput, value: pickupLocation },
            { field: dropoffLocationInput, value: dropoffLocation },
            { field: passengerCountInput, value: passengerCount },
            { field: paymentMethodInput, value: paymentMethod }
        ].forEach(item => {
            if (!item.value) {
                item.field.style.borderColor = '#ff3333';
                item.field.style.backgroundColor = '#fff0f0';
                setTimeout(() => {
                    item.field.style.borderColor = '';
                    item.field.style.backgroundColor = '';
                }, 3000);
            }
        });
        return;
    }

    try {
        // The backend `/api/passenger/request-ride` will handle driver assignment.
        const response = await makeRequest('/api/passenger/request-ride', 'POST', {
            pickupLocation,
            dropoffLocation,
            passengerCount,
            paymentMethod
        });
        displayMessage(requestRideMessage, response.message || 'Ride requested successfully! Waiting for driver...', true);
        console.log('[requestRide] Ride requested successfully.');
        
        pickupLocationInput.value = '';
        dropoffLocationInput.value = '';
        passengerCountInput.value = '1';
        paymentMethodInput.value = '';
        
        loadPassengerDashboardData(); // Refresh passenger dashboard rides
        loadPassengerRides();
    } catch (error) {
        console.error('[requestRide] Error requesting ride:', error);
        displayMessage(requestRideMessage, error.message || 'Failed to request ride.', false);
    }
}

/**
 * Formats payment method values for display
 * @param {string} paymentMethod - The payment method value
 * @returns {string} - Formatted display text
 */
function formatPaymentMethod(paymentMethod) {
    const paymentMethodMap = {
        'cash': 'Cash',
        'credit_card': 'Credit Card',
        'debit_card': 'Debit Card',
        'digital_wallet': 'Digital Wallet (GrabPay, TouchNGo)',
        'bank_transfer': 'Online Banking'
    };
    return paymentMethodMap[paymentMethod] || paymentMethod || 'N/A';
}

/**
 * Initialize payment method styling
 * Adds CSS for payment method badges if not already present
 */
function initPaymentMethodStyles() {
    if (document.getElementById('payment-method-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'payment-method-styles';
    style.textContent = `
        .payment-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 600;
            text-transform: capitalize;
            display: inline-block;
        }
        .payment-badge.cash {
            background-color: #28a745; /* Green */
            color: white;
        }
        .payment-badge.credit-card {
            background-color: #007bff; /* Blue */
            color: white;
        }
        .payment-badge.debit-card {
            background-color: #6610f2; /* Purple */
            color: white;
        }
        .payment-badge.digital-wallet {
            background-color: #fd7e14; /* Orange */
            color: white;
        }
        .payment-badge.bank-transfer {
            background-color: #20c997; /* Teal */
            color: white;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Shows a popup notification at the top of the screen
 * @param {string} message - The message to display
 * @param {boolean} isSuccess - Whether this is a success (true) or error (false) message
 * @param {number} duration - Duration in ms before hiding (default 4000)
 */
function showNotification(message, isSuccess = true, duration = 4000) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.popup-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `popup-notification ${isSuccess ? 'success' : 'error'}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add styles if not present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .popup-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                min-width: 300px;
                max-width: 500px;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                border-left: 4px solid;
                animation: slideIn 0.3s ease-out;
            }
            .popup-notification.success {
                background-color: #d4edda;
                color: #155724;
                border-left-color: #28a745;
            }
            .popup-notification.error {
                background-color: #f8d7da;
                color: #721c24;
                border-left-color: #dc3545;
            }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2em;
                cursor: pointer;
                margin-left: 10px;
                opacity: 0.7;
            }
            .notification-close:hover {
                opacity: 1;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page and auto-remove
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.remove();
        }
    }, duration);
}

/**
 * Delete Driver Account
 */
window.deleteDriverAccount = async function() {
    console.log('[deleteDriverAccount] Attempting to delete driver account.');
    
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone. All your data including rides, earnings, and vehicles will be permanently removed.');
    
    if (!confirmed) {
        console.log('[deleteDriverAccount] Account deletion cancelled by user.');
        return;
    }

    const driverId = userData.driverId || userData.id;
    if (!driverId) {
        displayMessage(driverProfileResult, 'Driver ID not found for deletion.', false);
        return;
    }

    try {
        const response = await makeRequest(`/api/driver/account/${driverId}`, 'DELETE');
        console.log('[deleteDriverAccount] Driver account deleted successfully.');
        
        // Show success message
        alert('Your account has been successfully deleted. You will now be logged out.');
        
        // Clear local storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        
        // Redirect to login page or reload
        window.location.reload();
        
    } catch (error) {
        console.error('[deleteDriverAccount] Error deleting driver account:', error);
        displayMessage(driverProfileResult, error.message || 'Failed to delete account. Please try again.', false);
    }
}

/**
 * Delete Passenger Account
 */
window.deletePassengerAccount = async function() {
    console.log('[deletePassengerAccount] Attempting to delete passenger account.');
    
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone. All your data including ride history and payment information will be permanently removed.');
    
    if (!confirmed) {
        console.log('[deletePassengerAccount] Account deletion cancelled by user.');
        return;
    }

    const userId = userData.userId || userData.id;
    if (!userId) {
        displayMessage(passengerProfileResult, 'User ID not found for deletion.', false);
        return;
    }

    try {
        const response = await makeRequest(`/api/passenger/account/${userId}`, 'DELETE');
        console.log('[deletePassengerAccount] Passenger account deleted successfully.');
        
        // Show success message
        alert('Your account has been successfully deleted. You will now be logged out.');
        
        // Clear local storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        
        // Redirect to login page or reload
        window.location.reload();
        
    } catch (error) {
        console.error('[deletePassengerAccount] Error deleting passenger account:', error);
        displayMessage(passengerProfileResult, error.message || 'Failed to delete account. Please try again.', false);
    }
}

// Function to update stats cards by role and status
function updateRideStats(ridesData, role = 'all') {
    // For admin role, update comprehensive stats
    const totalElement = document.getElementById(`${role}-total-rides`);
    const completedElement = document.getElementById(`${role}-completed-rides`);
    const pendingElement = document.getElementById(`${role}-pending-rides`);
    const inProgressElement = document.getElementById(`${role}-in-progress-rides`);
    
    if (!ridesData || !Array.isArray(ridesData)) return;
    
    const total = ridesData.length;
    const completed = ridesData.filter(ride => ride.status === 'completed').length;
    const pending = ridesData.filter(ride => ride.status === 'pending').length;
    const inProgress = ridesData.filter(ride => ride.status === 'in_progress').length;
    
    if (totalElement) totalElement.textContent = total;
    if (completedElement) completedElement.textContent = completed;
    if (pendingElement) pendingElement.textContent = pending;
    if (inProgressElement) inProgressElement.textContent = inProgress;
}

// --- Enhanced Admin Load Functions ---
