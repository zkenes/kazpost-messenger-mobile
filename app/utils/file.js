// Copyright (c) 2017-present TinkerTech, Inc. All Rights Reserved.
// See License.txt for license information.

import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';

import {lookupMimeType} from 'mattermost-redux/utils/file_utils';

import {DeviceTypes} from 'app/constants/';

const {DOCUMENTS_PATH, IMAGES_PATH, VIDEOS_PATH} = DeviceTypes;
const DEFAULT_SERVER_MAX_FILE_SIZE = 50 * 1024 * 1024;// 50 Mb

export const SUPPORTED_DOCS_FORMAT = [
    'application/json',
    'application/msword',
    'application/pdf',
    'application/rtf',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/x-x509-ca-cert',
    'application/xml',
    'text/csv',
    'text/plain',
];

const SUPPORTED_VIDEO_FORMAT = Platform.select({
    ios: ['video/mp4', 'video/x-m4v', 'video/quicktime'],
    android: ['video/3gpp', 'video/x-matroska', 'video/mp4', 'video/webm'],
});

export function generateId() {
    // Implementation taken from http://stackoverflow.com/a/2117523
    let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

    id = id.replace(/[xy]/g, (c) => {
        const r = Math.floor(Math.random() * 16);

        let v;
        if (c === 'x') {
            v = r;
        } else {
            v = (r & 0x3) | 0x8;
        }

        return v.toString(16);
    });

    return 'uid' + id;
}

export async function getFileCacheSize() {
    const isDocsDir = await RNFetchBlob.fs.isDir(DOCUMENTS_PATH);
    const isImagesDir = await RNFetchBlob.fs.isDir(IMAGES_PATH);
    const isVideosDir = await RNFetchBlob.fs.isDir(VIDEOS_PATH);
    let size = 0;

    if (isDocsDir) {
        const docsStats = await RNFetchBlob.fs.lstat(DOCUMENTS_PATH);
        size = docsStats.reduce((accumulator, stat) => {
            return accumulator + parseInt(stat.size, 10);
        }, size);
    }

    if (isImagesDir) {
        const imagesStats = await RNFetchBlob.fs.lstat(IMAGES_PATH);
        size = imagesStats.reduce((accumulator, stat) => {
            return accumulator + parseInt(stat.size, 10);
        }, size);
    }

    if (isVideosDir) {
        const videoStats = await RNFetchBlob.fs.lstat(VIDEOS_PATH);
        size = videoStats.reduce((accumulator, stat) => {
            return accumulator + parseInt(stat.size, 10);
        }, size);
    }

    return size;
}

export async function deleteFileCache() {
    await RNFetchBlob.fs.unlink(DOCUMENTS_PATH);
    await RNFetchBlob.fs.unlink(IMAGES_PATH);
    await RNFetchBlob.fs.unlink(VIDEOS_PATH);
    return true;
}

export function buildFileUploadData(file) {
    const re = /heic/i;
    const uri = file.uri;
    let name = file.fileName || file.name || file.path || file.uri;
    let mimeType = lookupMimeType(name.toLowerCase());
    let extension = name.split('.').pop().replace('.', '');

    if (re.test(extension)) {
        extension = 'JPG';
        name = name.replace(re, 'jpg');
        mimeType = 'image/jpeg';
    }

    return {
        uri,
        name,
        type: mimeType,
        extension,
    };
}

export const encodeHeaderURIStringToUTF8 = (string) => {
    return encodeURIComponent(string) + '"; filename*="utf-8\'\'' + encodeURIComponent(string);
};

export const getAllowedServerMaxFileSize = (config) => {
    return config && config.MaxFileSize ? parseInt(config.MaxFileSize, 10) : DEFAULT_SERVER_MAX_FILE_SIZE;
};

export const isGif = (file) => {
    let mime = file.mime_type || file.type || '';
    if (mime && mime.includes(';')) {
        mime = mime.split(';')[0];
    }

    return mime === 'image/gif';
};

export const isDocument = (file) => {
    let mime = file.mime_type || file.type || '';
    if (mime && mime.includes(';')) {
        mime = mime.split(';')[0];
    }

    return SUPPORTED_DOCS_FORMAT.includes(mime);
};

export const isVideo = (file) => {
    let mime = file.mime_type || file.type || '';
    if (mime && mime.includes(';')) {
        mime = mime.split(';')[0];
    }

    return SUPPORTED_VIDEO_FORMAT.includes(mime);
};
