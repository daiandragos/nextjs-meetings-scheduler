import { defineQuery } from "next-sanity";
import type {
  USER_WITH_TOKENS_QUERYResult,
  HOST_BY_SLUG_WITH_TOKENS_QUERYResult,
  USER_CONNECTED_ACCOUNTS_DISPLAY_QUERYResult,
} from "@/sanity/types";

export type ConnectedAccountWithTokens = NonNullable<
  NonNullable<USER_WITH_TOKENS_QUERYResult>["connectedAccounts"]
>[number];

export type HostWithTokens = NonNullable<HOST_BY_SLUG_WITH_TOKENS_QUERYResult>;

export type ConnectedAccountDisplay = NonNullable<
  NonNullable<USER_CONNECTED_ACCOUNTS_DISPLAY_QUERYResult>["connectedAccounts"]
>[number];
/**
 * Get user by the clerk Id
 */
export const USER_BY_CLERK_ID_QUERY = defineQuery(`*[
        _type == "user" && clerkId == $clerkId
    ][0]{
        _id,
        _type,
        clerkId,
        name,
        email,
        slug,
        availability[]{
            _key,
            startDateTime,
            endDateTime
        },
        connectedAccounts[]{
            _key,
            accountId,
            email,
            provider,
            isDefault,
            connectedAt
        }
    }`);

/**
 * Get user by their public booking slug
 */
export const USER_BY_SLUG_QUERY = defineQuery(`*[
        _type == "user" && slug.current == $slug
    ][0]{
        _id,
        _type,
        name,
        email,
        slug,
        availability[]{
            _key,
            startDateTime,
            endDateTime
        }
    }`);

/**
 * Get user with connected account tokens
 */
export const USER_WITH_TOKENS_QUERY = defineQuery(`*[
        _type == "user" && clerkId == $clerkId    
    ][0]{
        _id,
        connectedAccounts[]{
            _key,
            accountId,
            email,
            accessToken,
            refreshToken,
            expiryDate,
            isDefault,
        }
    }`);

/**
 * Get user ID by connected account key
 */
export const USER_ID_BY_ACCOUNT_KEY_QUERY = defineQuery(`*[
        _type == "user" && defined(connectedAccounts[_key == $accountKey])
    ][0]{
        _id
    }`);

/**
 * Get user ID by clerkId
 */
export const USER_ID_BY_CLERK_ID_QUERY = defineQuery(`*[
        _type == "user" && clerkId == $clerkId
    ][0]{
        _id
    }`);

/**
 * Get user with availability by clerk Id
 */
export const USER_WITH_AVAILABILTY_QUERY = defineQuery(`*[
        _type == "user" && clerkId == $clerkId
    ][0]{
        _id,
        availability[]{
            _key,
            startDateTime,
            endDateTime
        }
    }`);

/**
 * Get user with connected accounts for OAuth callback
 */
export const USER_WITH_CONNECTED_ACCOUNTS_QUERY = defineQuery(`*[
        _type == "user" && clerkId == $clerkId
    ][0]{
        _id,
        connectedAccounts[]{
            accountId
        }
    }`);

/**
 * Get host by slug
 */
export const HOST_BY_SLUG_WITH_TOKENS_QUERY = defineQuery(`*[
        _type == "user" && slug.current == $slug
    ][0]{
        _id, 
        name,
        email,
        slug,
        availability[]{
            _key,
            startDateTime,
            endDateTime
        },
        connectedAccounts[]{
            _key,
            accountId,
            email,
            accessToken,
            refreshToken,
            expiryDate,
            isDefault,
        }
    }`);

/**
 *  Get connected accounts for display - for Sanity Live
 */
export const USER_CONNECTED_ACCOUNTS_DISPLAY_QUERY = defineQuery(`*[
    _type == "user"
    && clerkId == $clerkId][0] {
        connectedAccounts[]{
        _key,
        accountId,
        email,
        isDefault
        }
    }`);

/**
 * Get user's slug and name for share Link
 */
export const USER_SLUG_QUERY = defineQuery(`*[
    _type == "user" && clerkId == $clerkId
    ][0] {
        _id, 
        name,
        slug
    }`);

/**
 * Count the user's bookings
 */
export const COUNT_USER_BOOKINGS_QUERY = defineQuery(`count(*[
        _type == "booking"
        && host->clerkId == $clerkId
        && startTime >= $monthStart
        && startTime < $monthEnd
    ])`);

/**
 * Check if there are connected accounts
 */
export const HAS_CONNECTED_ACCOUNT_QUERY = defineQuery(`count(*[
        _type == "user"
        && clerkId == $clerkId
        && defined(connectedAccounts)
        && length(connectedAccounts) > 0
    ]) > 0`);
/**
 * Get host's clerkId by their slug
 */
export const HOST_CLERK_ID_BY_SLUG_QUERY = `*[
  _type == "user"
  && slug.current == $hostSlug
][0].clerkId`;

/**
 * Count bookings for a host in a certain date range
 */

export const COUNT_HOST_BOOKINGS_QUERY = `count(*[
  _type == "booking"
  && host->slug.current == $hostSlug
  && startTime >= $monthStart
  && startTime < $monthEnd
])`;
