package com.arcana.neondrop;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.widget.FrameLayout;
import java.io.ByteArrayInputStream;

public final class MainActivity extends Activity {
    private WebView web;
    private static final String GAME_URL = "https://appassets.androidplatform.net/neon-drop.html";
    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(9,12,19));
        getWindow().setNavigationBarColor(Color.rgb(9,12,19));
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(9,12,19));
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(9,12,19));
        root.addView(web, new FrameLayout.LayoutParams(-1,-1));
        setContentView(root);
        if (android.os.Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((v,insets)->{
                android.graphics.Insets safe=insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(safe.left,safe.top,safe.right,safe.bottom);
                return insets;
            });
            root.requestApplyInsets();
        }
        WebSettings settings=web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportZoom(false);
        web.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) { return !GAME_URL.equals(req.getUrl().toString()); }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
                if (GAME_URL.equals(req.getUrl().toString())) {
                    try { return new WebResourceResponse("text/html", "UTF-8", getAssets().open("neon-drop.html")); }
                    catch(java.io.IOException error) { return new WebResourceResponse("text/plain","UTF-8",500,"Missing game",null,new ByteArrayInputStream(new byte[0])); }
                }
                return new WebResourceResponse("text/plain","UTF-8",404,"Not found",null,new ByteArrayInputStream(new byte[0]));
            }
        });
        web.loadUrl(GAME_URL);
    }
    @Override protected void onPause() {
        web.evaluateJavascript("if(typeof pause==='function')pause();if(typeof audio!=='undefined'&&audio)audio.suspend().catch(()=>{});",null);
        web.onPause();
        super.onPause();
    }
    @Override protected void onResume() { super.onResume(); if(web!=null)web.onResume(); }
    @Override public void onBackPressed() {
        web.evaluateJavascript("(()=>{const d=document.querySelector('dialog[open]');if(d){if(d.id==='modal')return true;d.close();return true;}if(typeof state!=='undefined'&&state==='playing'){pause();return true;}return false;})()",handled->{if("false".equals(handled))finish();});
    }
    @Override protected void onDestroy() { if(web!=null){web.stopLoading();web.destroy();web=null;}super.onDestroy(); }
}
