/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as floatings from "../floatings.js";
import type * as gallery from "../gallery.js";
import type * as inquiries from "../inquiries.js";
import type * as materials from "../materials.js";
import type * as notices from "../notices.js";
import type * as orders from "../orders.js";
import type * as popups from "../popups.js";
import type * as products from "../products.js";
import type * as storeInquiries from "../storeInquiries.js";
import type * as stores from "../stores.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  floatings: typeof floatings;
  gallery: typeof gallery;
  inquiries: typeof inquiries;
  materials: typeof materials;
  notices: typeof notices;
  orders: typeof orders;
  popups: typeof popups;
  products: typeof products;
  storeInquiries: typeof storeInquiries;
  stores: typeof stores;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
