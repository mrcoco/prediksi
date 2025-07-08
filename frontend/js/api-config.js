// API Configuration for EduPro Frontend
const API_CONFIG = {
    // Base URL from environment
    BASE_URL: window.ENV ? window.ENV.EDUPRO_API_URL : '/api',

    // Endpoints
    ENDPOINTS: {
        // Authentication
        AUTH: {
            LOGIN: '/auth/token',
            REFRESH: '/auth/refresh',
            REGISTER: '/auth/register'
        },

        // Prediction
        PREDICTION: {
            SINGLE: '/prediksi',
            BATCH: '/prediksi/batch',
            HISTORY: '/prediksi/history',
            TRAIN: '/prediksi/train',
            METRICS: '/prediksi/model-metrics',
            CONFUSION_MATRIX: '/prediksi/confusion-matrix',
            FEATURE_STATS: '/prediksi/feature-statistics',
            RULES: '/prediksi/rules',
            EXPORT: '/prediksi/history/export/excel'
        },

        // Data Management
        DATA: {
            GENERATE_DUMMY: '/prediksi/generate-dummy',
            GENERATE_DUMMY_BY_NAME: '/prediksi/generate-dummy-by-name'
        }
    },

    // HTTP Methods
    METHODS: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE'
    },

    // Helper function to get full URL
    getUrl: function(endpoint) {
        return `${this.BASE_URL}${endpoint}`;
    },

    // Helper function to add auth header
    getAuthHeader: function() {
        const token = localStorage.getItem('access_token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // Helper function for API calls
    callApi: function(endpoint, method = 'GET', data = null, additionalHeaders = {}, isFormData = false) {
        const headers = {
            ...this.getAuthHeader(),
            ...additionalHeaders
        };

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const config = {
            url: this.getUrl(endpoint),
            method: method,
            headers: headers
        };

        if (data) {
            if (method === 'GET') {
                config.params = data;
            } else if (isFormData) {
                const formData = new URLSearchParams();
                for (const key in data) {
                    formData.append(key, data[key]);
                }
                config.data = formData.toString();
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            } else {
                config.data = JSON.stringify(data);
            }
        }

        return new Promise((resolve, reject) => {
            $.ajax(config)
                .done(resolve)
                .fail(reject);
        });
    },

    // Helper function specifically for login
    login: function(username, password) {
        return this.callApi(
            this.ENDPOINTS.AUTH.LOGIN,
            this.METHODS.POST,
            {
                username: username,
                password: password,
                grant_type: 'password'
            },
            {},
            true // isFormData = true
        );
    }
}; 