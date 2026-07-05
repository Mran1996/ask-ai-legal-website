/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as cases from "../cases.js";
import type * as documents from "../documents.js";
import type * as emailActions from "../emailActions.js";
import type * as estimates from "../estimates.js";
import type * as health from "../health.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_caEvictionPricing from "../lib/caEvictionPricing.js";
import type * as lib_customFunctions from "../lib/customFunctions.js";
import type * as lib_intakeMapping from "../lib/intakeMapping.js";
import type * as lib_opsAuth from "../lib/opsAuth.js";
import type * as lib_scheduleIntakeEmails from "../lib/scheduleIntakeEmails.js";
import type * as lib_servicePricing from "../lib/servicePricing.js";
import type * as lib_validators from "../lib/validators.js";
import type * as notifications from "../notifications.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  cases: typeof cases;
  documents: typeof documents;
  emailActions: typeof emailActions;
  estimates: typeof estimates;
  health: typeof health;
  "lib/auth": typeof lib_auth;
  "lib/caEvictionPricing": typeof lib_caEvictionPricing;
  "lib/customFunctions": typeof lib_customFunctions;
  "lib/intakeMapping": typeof lib_intakeMapping;
  "lib/opsAuth": typeof lib_opsAuth;
  "lib/scheduleIntakeEmails": typeof lib_scheduleIntakeEmails;
  "lib/servicePricing": typeof lib_servicePricing;
  "lib/validators": typeof lib_validators;
  notifications: typeof notifications;
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
