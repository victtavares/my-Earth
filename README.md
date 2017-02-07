Building for Android
--------------------

1. `cordova platform add android`
2. `ionic build --release android`


Debugging with an Android Device
--------------------------------

This will show the console log messages while the app is running, which is
very helpful for debugging.

`ionic run --livereload --consolelogs`


Google Analytics
----------------

Use version 1.0.0 of cordova-google-analytics-plugin because of this
issue causing App Store rejections.

https://github.com/danwilson/google-analytics-plugin/issues/218
