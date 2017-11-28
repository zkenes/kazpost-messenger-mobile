package com.mattermost.rnbeta;

import android.graphics.Canvas;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

public class MaxImageDimensionsModule extends ReactContextBaseJavaModule {
    private WritableMap dimensions;
    private Object lock = new Object();

    public MaxImageDimensionsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "MaxImageDimensionsModule";
    }

    @ReactMethod
    public int getMaxImageDimensions() {
        synchronized (lock) {
            if (dimensions == null) {
                Canvas canvas = new Canvas();

                dimensions = Arguments.createMap();
                dimensions.putInt("width", canvas.getMaximumBitmapWidth());
                dimensions.putInt("height", canvas.getMaximumBitmapHeight());
            }
        }

        return 7;
        // return dimensions;
    }
}
