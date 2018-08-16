import { get } from '../utils/fetch-util';

/**
 * @param {string} name - target of patient search
 * @returns {Promise} - contains parsed patient data
 */
export function getPatients(queryParam, queryValue) {
    return get({
        url: 'https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca',
        resource: 'Patient',
        query: {
            [queryParam]: queryValue,
        },
    }).then(parsePatientBundle);
}

/**
 *
 * @param {string} link - api provided address for pagination
 * @returns {Promise} - contains parsed patient data
 */
export function paginatePatients(link) {
    return get({ url: link })
        .then(parsePatientBundle);
}

/**
 * Describes consumed properties of a Patient entry
 * @typedef {object} PatientEntry
 * @property {object} resource - full record of a patient
 *
 * @typedef {object} PatientLink
 * @property {string} relation - identifies the type of location the url will provide
 * @property {string} url - address of the described relation link
 *
 * @param {object} data - raw data from patient request
 * @property {PatientEntry[]} data.entry - list of patient entries
 * @property {PatientLink[]} data.link - list of metadata referencing resource locations, including pagination

 */
function parsePatientBundle({ entry, link }) {
    const next = link.find(l => l.relation === 'next');
    const previous = link.find(l => l.relation === 'previous');
    const patients = entry && entry.map(({ resource }) => resource);

    return {
        patients,
        next: (next && next.url) || null,
        previous: (previous && previous.url) || null,
    };
}