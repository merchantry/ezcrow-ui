import { newArray } from 'utils/arrays';
import { randomListing } from 'utils/random';
import { Listing } from 'utils/types';

const listings: Listing[] = newArray(500, randomListing);

export default listings;
