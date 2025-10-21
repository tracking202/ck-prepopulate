/**
 * ConvertKit Pre-Populate Script
 * Enhanced with configuration, validation, and error handling
 * @version 2.0.0
 * @license MIT
 */

(function(window) {
    'use strict';

    // Default configuration
    const defaultConfig = {
        // Field mappings: URL param -> form field name
        fields: {
            fn: 'fields[first_name]',
            em: 'email_address'
        },
        // Validation options
        validation: {
            enabled: true,
            maxLength: 255,
            allowedEmailDomains: [], // Empty = allow all
            sanitizeInput: true
        },
        // Error handling options
        debug: false,
        clearOnError: false,
        onSuccess: null,
        onError: null,
        onValidationError: null
    };

    // Merge user config with defaults
    let config = Object.assign({}, defaultConfig);

    /**
     * CKPrePop - ConvertKit Pre-Population utility
     */
    const CKPrePop = {
        /**
         * Initialize with custom configuration
         * @param {Object} userConfig - Custom configuration options
         */
        init: function(userConfig) {
            try {
                // Deep merge configuration
                config = this._deepMerge(defaultConfig, userConfig || {});

                if (config.debug) {
                    console.log('[CKPrePop] Initialized with config:', config);
                }

                // Auto-populate on init
                this.populate();

                return this;
            } catch (error) {
                this._handleError('Initialization error', error);
                return this;
            }
        },

        /**
         * Populate form fields from URL parameters
         */
        populate: function() {
            try {
                const data = {};
                let hasErrors = false;

                // Extract and validate each field
                for (const [urlParam, fieldName] of Object.entries(config.fields)) {
                    const value = this._getUrlParam(urlParam);

                    if (value) {
                        // Validate and sanitize input
                        const validatedValue = this._validateInput(urlParam, value);

                        if (validatedValue !== null) {
                            // Set form field
                            const success = this._setFormField(fieldName, validatedValue);

                            if (success) {
                                data[urlParam] = validatedValue;
                            } else {
                                hasErrors = true;
                            }
                        } else {
                            hasErrors = true;
                        }
                    }
                }

                // Trigger success callback if data was populated
                if (Object.keys(data).length > 0 && !hasErrors) {
                    if (config.debug) {
                        console.log('[CKPrePop] Successfully populated fields:', data);
                    }

                    if (typeof config.onSuccess === 'function') {
                        config.onSuccess(data);
                    }
                }

                return data;
            } catch (error) {
                this._handleError('Population error', error);
                return {};
            }
        },

        /**
         * Get URL parameter (case-insensitive)
         * @param {string} urlParam - Parameter name to search for
         * @returns {string|null} Parameter value or null
         */
        _getUrlParam: function(urlParam) {
            try {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);

                for (const [name, value] of urlParams) {
                    if (name.toLowerCase() === urlParam.toLowerCase()) {
                        return value;
                    }
                }
                return null;
            } catch (error) {
                this._handleError('URL parameter extraction error', error);
                return null;
            }
        },

        /**
         * Validate and sanitize input
         * @param {string} paramName - Parameter name (for email validation)
         * @param {string} value - Value to validate
         * @returns {string|null} Sanitized value or null if invalid
         */
        _validateInput: function(paramName, value) {
            if (!config.validation.enabled) {
                return value;
            }

            try {
                // Check for null/undefined
                if (!value) {
                    return '';
                }

                // Convert to string
                value = String(value);

                // Check maximum length
                if (value.length > config.validation.maxLength) {
                    this._handleValidationError(
                        `Value exceeds maximum length of ${config.validation.maxLength}`,
                        paramName,
                        value
                    );
                    return null;
                }

                // Sanitize input to prevent XSS
                if (config.validation.sanitizeInput) {
                    value = this._sanitizeString(value);
                }

                // Email-specific validation (for 'em' parameter)
                if (paramName.toLowerCase() === 'em') {
                    if (!this._isValidEmail(value)) {
                        this._handleValidationError(
                            'Invalid email format',
                            paramName,
                            value
                        );
                        return null;
                    }

                    // Check allowed domains if configured
                    if (config.validation.allowedEmailDomains.length > 0) {
                        const domain = value.split('@')[1];
                        if (!config.validation.allowedEmailDomains.includes(domain)) {
                            this._handleValidationError(
                                'Email domain not allowed',
                                paramName,
                                value
                            );
                            return null;
                        }
                    }
                }

                return value;
            } catch (error) {
                this._handleError('Validation error', error);
                return null;
            }
        },

        /**
         * Sanitize string to prevent XSS attacks
         * @param {string} str - String to sanitize
         * @returns {string} Sanitized string
         */
        _sanitizeString: function(str) {
            const map = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                "/": '&#x2F;',
            };
            const reg = /[<>"'/]/ig;
            return str.replace(reg, (match) => (map[match]));
        },

        /**
         * Validate email format
         * @param {string} email - Email to validate
         * @returns {boolean} True if valid
         */
        _isValidEmail: function(email) {
            // RFC 5322 compliant email regex (simplified)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        /**
         * Set form field value
         * @param {string} fieldName - Form field name attribute
         * @param {string} value - Value to set
         * @returns {boolean} True if successful
         */
        _setFormField: function(fieldName, value) {
            try {
                const field = document.getElementsByName(fieldName)[0];

                if (!field) {
                    if (config.debug) {
                        console.warn(`[CKPrePop] Field not found: ${fieldName}`);
                    }
                    return false;
                }

                field.value = value || '';

                if (config.debug) {
                    console.log(`[CKPrePop] Set field "${fieldName}" to:`, value);
                }

                return true;
            } catch (error) {
                this._handleError(`Error setting field: ${fieldName}`, error);

                if (config.clearOnError) {
                    try {
                        const field = document.getElementsByName(fieldName)[0];
                        if (field) field.value = '';
                    } catch (e) {
                        // Silently fail
                    }
                }

                return false;
            }
        },

        /**
         * Handle validation errors
         * @param {string} message - Error message
         * @param {string} paramName - Parameter name
         * @param {string} value - Invalid value
         */
        _handleValidationError: function(message, paramName, value) {
            if (config.debug) {
                console.warn(`[CKPrePop] Validation error: ${message}`, {
                    param: paramName,
                    value: value
                });
            }

            if (typeof config.onValidationError === 'function') {
                config.onValidationError({
                    message: message,
                    param: paramName,
                    value: value
                });
            }
        },

        /**
         * Handle general errors
         * @param {string} message - Error message
         * @param {Error} error - Error object
         */
        _handleError: function(message, error) {
            if (config.debug) {
                console.error(`[CKPrePop] ${message}:`, error);
            }

            if (typeof config.onError === 'function') {
                config.onError({
                    message: message,
                    error: error
                });
            }
        },

        /**
         * Deep merge objects
         * @param {Object} target - Target object
         * @param {Object} source - Source object
         * @returns {Object} Merged object
         */
        _deepMerge: function(target, source) {
            const output = Object.assign({}, target);

            if (this._isObject(target) && this._isObject(source)) {
                Object.keys(source).forEach(key => {
                    if (this._isObject(source[key])) {
                        if (!(key in target)) {
                            Object.assign(output, { [key]: source[key] });
                        } else {
                            output[key] = this._deepMerge(target[key], source[key]);
                        }
                    } else {
                        Object.assign(output, { [key]: source[key] });
                    }
                });
            }

            return output;
        },

        /**
         * Check if value is an object
         * @param {*} item - Item to check
         * @returns {boolean} True if object
         */
        _isObject: function(item) {
            return item && typeof item === 'object' && !Array.isArray(item);
        }
    };

    // Auto-initialize with defaults when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            CKPrePop.populate();
        });
    } else {
        // DOM already loaded
        CKPrePop.populate();
    }

    // Expose to global scope
    window.CKPrePop = CKPrePop;

})(window);
