/**
 * Leverages native `fetch` api to make GET requests
 * @param {object} data
 * @property {string} data.url - service root url
 * @property {string} data.resource - FHIR standard resource
 * @property {object} data.query - query parameters for the request; vary by resource
 * @returns {Promise} - chainable and contains json data from the response
 */

export function get({
    url,
    resource = '',
    query = {},
}) {
    const queryString = formatQueryParams(query);
    const rsc = resource ? '/' + resource: '';
    const requestURL = `${url}${rsc}${queryString}`;
    return fetch(requestURL, {
        headers: {
            Accept: 'application/json+fhir',
        },
    })
    .then(checkStatus)
    .catch(error => {
        if (error instanceof TypeError) {
            throw new Error('There was an issue contacting the server.');
        }

        console.error('An unexpected error occured');
        throw error;
    });
}

/**
 * Converts a dictionary of query params to a query string
 * @param {object} queryParams - dictionary of query parameters
 * @returns {string}
 */
function formatQueryParams(queryParams) {
    const queryString = Object.keys(queryParams)
        .map(k => `${k}=${queryParams[k]}`)
        .join('&');
    return queryString.length ? '?' + queryString : '';
}

/**
 * Checks if response was in error and reads the stream or throws
 * @param {Response} response - Response stream object from fetchAPI
 * @returns {object} - json response data
 */
function checkStatus(response) {
    const { status, statusText } = response;
    if (status >= 200 && status < 300) {
        return response.json();
    }

    throw new Error(statusText);
}