// Copyright (c) 2018-present TinkerTech, Inc. All Rights Reserved.
// See License.txt for license information.

import {ViewTypes} from 'app/constants';

export function dismissBanner(text) {
    return {
        type: ViewTypes.ANNOUNCEMENT_BANNER,
        data: text,
    };
}
