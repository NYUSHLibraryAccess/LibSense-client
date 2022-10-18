# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/NYUSHLibraryAccess/LibSense-client/compare/v1.1.0...v1.2.0) (2022-10-18)


### Features

* **order-table:** support estimate arrival date ([01def2f](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/01def2fd877c35ff10abd5627b273db1f5a1c839))

## [1.1.0](https://github.com/NYUSHLibraryAccess/LibSense-client/compare/v1.0.0...v1.1.0) (2022-10-18)


### Features

* **order-editor:** support marking as requiring checking and marking as sensitive ([aa2d494](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/aa2d494ed551a1656d5ff00ee8ce7d029240cc1d))
* support permission control ([8187677](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/818767786502557861eb67e4fdf666c5d15f0c16))


### Bug Fixes

* **nav-menu:** show a loading page when fetching authentication status ([8b17cf5](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/8b17cf5d723de8025a3f08481cce17c175d5d614))
* **order-editor:** `null` is now the only falsy value in input components and order updating logic ([46dc874](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/46dc874186c581610731e5c34ea9409d04317894))
* **order-editor:** disable footer buttons conditionally and improve loading overlay ([f0aa137](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/f0aa13747234ae5507ec5dc61414ce0784ad866c))
* **order-editor:** error messages after updating orders now contain error messages from server ([ad62d7c](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/ad62d7c904d5d6193506d2b76ac411015e0f0ea2))
* **order-editor:** fix glitches in input component logics ([a2ef1c4](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/a2ef1c460927bfbda4e90cbe33227fe14a0618ab))
* **order-editor:** improve logics in hooks ([71a59a0](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/71a59a0a88220b964834fb9292e8e9544d7104f2))
* **order-editor:** remove redundant fallback logics for malformed server data and reuse components ([3837708](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/383770865089df6c94063b5dd1666830d8c584b9))
* **order-editor:** rename to mark as checking-required ([fcbab26](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/fcbab26f99f733db13b6a69d5a8c51c51f0186fe))
* **order-editor:** reset overrideReminderTime on deselecting ([be79969](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/be79969db79041aafa3c09a305c60de478ec524b))
* **order-table:** avoid resetting pageIndex when opening OrderEditor ([fdd0889](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/fdd08895ea648a8ec3860be94589fde371bbc162))
* **order-table:** make expressions in the hook dependencies more precise ([5d5e819](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/5d5e81922f1dbfc5187cf412f4330f312d81cac6))
* **order-table:** remove functionality of highlighting checked orders ([012c5ab](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/012c5ab577c774ce65ef92f7e8394f9bacbbca78))
* remove orderPurchasedDate field ([05af424](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/05af424b39b3c2c51aa5967670667024b206f27f))

## 1.0.0 (2022-10-10)


### Features

* implement initial features ([7a4dddb](https://github.com/NYUSHLibraryAccess/LibSense-client/commit/7a4dddbca32bcdf49701b8eabd8722f91068a6e3))
