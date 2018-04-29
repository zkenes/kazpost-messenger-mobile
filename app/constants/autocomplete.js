// Copyright (c) 2017-present TinkerTech, Inc. All Rights Reserved.
// See License.txt for license information.

export const AT_MENTION_REGEX = /\B(@([^@\r\n\s]*))$/i;

export const AT_MENTION_SEARCH_REGEX = /\bfrom:\s*(\S*)$/i;

export const CHANNEL_MENTION_REGEX = /\B(~([^~\r\n]*))$/i;

export const CHANNEL_MENTION_SEARCH_REGEX = /\b(?:in|channel):\s*(\S*)$/i;
