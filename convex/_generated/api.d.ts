/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as appointments from "../appointments.js";
import type * as cases from "../cases.js";
import type * as contactActions from "../contactActions.js";
import type * as documents from "../documents.js";
import type * as draftPackageActions from "../draftPackageActions.js";
import type * as emailActions from "../emailActions.js";
import type * as estimates from "../estimates.js";
import type * as health from "../health.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_bookingUrls from "../lib/bookingUrls.js";
import type * as lib_buildIntakeDocx from "../lib/buildIntakeDocx.js";
import type * as lib_caEvictionPricing from "../lib/caEvictionPricing.js";
import type * as lib_caseLookup from "../lib/caseLookup.js";
import type * as lib_customFunctions from "../lib/customFunctions.js";
import type * as lib_emailBranding from "../lib/emailBranding.js";
import type * as lib_intakeMapping from "../lib/intakeMapping.js";
import type * as lib_intakeMatterCategory from "../lib/intakeMatterCategory.js";
import type * as lib_letterheadLogoBase64 from "../lib/letterheadLogoBase64.js";
import type * as lib_opsAuth from "../lib/opsAuth.js";
import type * as lib_outlookFolderName from "../lib/outlookFolderName.js";
import type * as lib_quoteTotal from "../lib/quoteTotal.js";
import type * as lib_scheduleIntakeEmails from "../lib/scheduleIntakeEmails.js";
import type * as lib_servicePricing from "../lib/servicePricing.js";
import type * as lib_validators from "../lib/validators.js";
import type * as notifications from "../notifications.js";
import type * as outlookActions from "../outlookActions.js";
import type * as payments from "../payments.js";
import type * as stripeActions from "../stripeActions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  appointments: typeof appointments;
  cases: typeof cases;
  contactActions: typeof contactActions;
  documents: typeof documents;
  draftPackageActions: typeof draftPackageActions;
  emailActions: typeof emailActions;
  estimates: typeof estimates;
  health: typeof health;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  "lib/bookingUrls": typeof lib_bookingUrls;
  "lib/buildIntakeDocx": typeof lib_buildIntakeDocx;
  "lib/caEvictionPricing": typeof lib_caEvictionPricing;
  "lib/caseLookup": typeof lib_caseLookup;
  "lib/customFunctions": typeof lib_customFunctions;
  "lib/emailBranding": typeof lib_emailBranding;
  "lib/intakeMapping": typeof lib_intakeMapping;
  "lib/intakeMatterCategory": typeof lib_intakeMatterCategory;
  "lib/letterheadLogoBase64": typeof lib_letterheadLogoBase64;
  "lib/opsAuth": typeof lib_opsAuth;
  "lib/outlookFolderName": typeof lib_outlookFolderName;
  "lib/quoteTotal": typeof lib_quoteTotal;
  "lib/scheduleIntakeEmails": typeof lib_scheduleIntakeEmails;
  "lib/servicePricing": typeof lib_servicePricing;
  "lib/validators": typeof lib_validators;
  notifications: typeof notifications;
  outlookActions: typeof outlookActions;
  payments: typeof payments;
  stripeActions: typeof stripeActions;
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
