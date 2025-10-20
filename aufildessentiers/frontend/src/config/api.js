
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.aufildessentiers.mehdikorichi.com";

export const API_ENDPOINTS = {
    // Nouveaux endpoints Node.js sécurisés
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    PROTECTED: `${API_BASE_URL}/api/auth/protected`,
    PUBLIC_DATA: `${API_BASE_URL}/api/public/public-data`,
    LOGS: `${API_BASE_URL}/api/logs`,
    RESEND_VERIFICATION: `${API_BASE_URL}/api/auth/resend-verification`,
    
    // Événements
    EVENTS: `${API_BASE_URL}/api/events`,
    // Blog
    BLOG: `${API_BASE_URL}/api/blog`,
    BLOG_ARTICLE: (id) => `${API_BASE_URL}/api/blog/${id}`,
    
    // Inscriptions aux événements
    JOIN_EVENT: (eventId) => `${API_BASE_URL}/api/event-registrations/join/${eventId}`,
    LEAVE_EVENT: (eventId) => `${API_BASE_URL}/api/event-registrations/leave/${eventId}`,
    MY_REGISTRATIONS: `${API_BASE_URL}/api/event-registrations/my-registrations`,
    EVENT_REGISTRATIONS: (eventId) => `${API_BASE_URL}/api/event-registrations/event/${eventId}`,
    UPDATE_REGISTRATION_STATUS: (registrationId) => `${API_BASE_URL}/api/event-registrations/${registrationId}/status`,
    REGISTRATION_STATS: `${API_BASE_URL}/api/event-registrations/stats`,
    
    // Admin
    ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
    ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
    ADMIN_UPDATE_USER_STATUS: (userId) => `${API_BASE_URL}/api/admin/users/${userId}/status`,
    ADMIN_DELETE_USER: (userId) => `${API_BASE_URL}/api/admin/users/${userId}`,
    ADMIN_CREATE_EVENT: `${API_BASE_URL}/api/admin/events`,
    ADMIN_PENDING_REGISTRATIONS: `${API_BASE_URL}/api/admin/registrations/pending`,
    ADMIN_UPDATE_REGISTRATION_STATUS: (registrationId) => `${API_BASE_URL}/api/admin/registrations/${registrationId}/status`,
        // Contacts
        CONTACTS: `${API_BASE_URL}/api/contacts`,
        MARK_CONTACT_READ: (id) => `${API_BASE_URL}/api/contacts/${id}/read`,
    
    // Anciens endpoints PHP (pour compatibilité)
    VERIFY_EMAIL: `${API_BASE_URL}/routes/api.php?route=verify-email`,
    // Auth verification (modern endpoint)
    VERIFY_EMAIL_API: `${API_BASE_URL}/api/auth/verify-email`,
    USERS: `${API_BASE_URL}/routes/api.php?route=users`,
    UPLOAD: `${API_BASE_URL}/routes/upload.php`,
    BASE_URL: API_BASE_URL
};