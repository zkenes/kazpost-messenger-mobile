// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

const maxDimensions = {
    height: Number.MAX_SAFE_INTEGER,
    width: Number.MAX_SAFE_INTEGER
};

// As far as we know, there are no max image dimensions on iOS when loading
// an image into memory.
export function getMaxImageDimensions() {
    return maxDimensions;
}
