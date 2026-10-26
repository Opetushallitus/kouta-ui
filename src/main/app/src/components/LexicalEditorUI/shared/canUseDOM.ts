/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const CAN_USE_DOM: boolean = Boolean(
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- TS resolves this uncalled property read to Document's deprecated-tag-name overload of createElement, not an actual use of a deprecated API
  globalThis.window?.document?.createElement
);
