// Copyright (c) 2016-present TinkerTech, Inc. All Rights Reserved.
// See License.txt for license information.

import 'intl';
import {addLocaleData} from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import ruLocaleData from 'react-intl/locale-data/ru';

import en from 'assets/i18n/en.json';
import ru from 'assets/i18n/ru.json';

export const DEFAULT_LOCALE = 'ru';

const TRANSLATIONS = {
    en,
    ru,
};

addLocaleData(enLocaleData);
addLocaleData(ruLocaleData);


export function getTranslations(locale) {
    return TRANSLATIONS[locale] || TRANSLATIONS[DEFAULT_LOCALE];
}
