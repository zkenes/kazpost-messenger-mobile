// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {NativeModules} from 'react-native';

export function getMaxImageDimensions() {
    return {width: 4096, height: 4096};
    return NativeModules.MaxImageDimensions.getMaxImageDimensions();
}
