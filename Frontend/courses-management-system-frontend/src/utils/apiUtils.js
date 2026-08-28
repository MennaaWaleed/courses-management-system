/**
 * Safely extracts a human-readable error message from an API response.
 * Handles Spring Boot JSON formats, plain text, and network errors.
 */
export const getApiErrorMessage = (error) => {
  // 1. Network errors or CORS issues (Server unreachable)
  if (!error.response) {
    return "Unable to connect to the server. Please check your connection.";
  }

  const { status, data } = error.response;

  // 2. Server Crashes (HTTP 500)
  if (status === 500) {
    return "Something went wrong on the server. Please try again.";
  }

  // 3. Not Found (HTTP 404)
  if (status === 404) {
    return "The requested endpoint or resource was not found.";
  }

  // 4. If the backend returns a simple string (e.g., ResponseEntity.badRequest().body("Error"))
  if (typeof data === 'string' && data.trim() !== '') {
    return data;
  }

  // 5. Spring Boot standard error responses (JSON objects)
  if (data && typeof data === 'object') {
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.detail) return data.detail;
  }

  // 6. Ultimate fallback
  return "An unexpected error occurred. Please try again.";
};