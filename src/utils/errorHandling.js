export const handleApiError = (error, defaultMessage = 'An error occurred') => {
    console.error(error);
    if (error.response) {
      // Handle server errors
      return error.response.data.message || defaultMessage;
    }
    if (error.request) {
      // Handle network errors
      return 'Network error. Please check your connection.';
    }
    return defaultMessage;
  };