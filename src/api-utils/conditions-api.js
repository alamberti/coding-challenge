import { get } from '../utils/fetch-util';

export function getConditions(queryParam, queryValue) {
    return get({
        url: 'https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca',
        resource: 'Condition',
        query: {
            [queryParam]: queryValue,
        },
    }).then(parseConditionBundle);
}

function parseConditionBundle({ entry, link }) {
    const conditions = entry ? entry.map(({ resource }) => resource) : [];
    return {
        conditions,
    };
}