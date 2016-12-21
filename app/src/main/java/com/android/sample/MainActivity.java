package com.android.sample;

import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.DisplayMetrics;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;


public class MainActivity extends AppCompatActivity {

    public static final String HTML_PAGE = "file:///android_asset/question_svg.html";
    private Crossfader crossFader;
    private WebView web_map;

    public static float convertDpToPixel(float dp, Context context) {
        Resources resources = context.getResources();
        DisplayMetrics metrics = resources.getDisplayMetrics();
        float px = dp * (metrics.densityDpi / 160f);
        return px;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        FloatingActionButton floatingActionButton = (FloatingActionButton) findViewById(R.id.foolting);
        floatingActionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(MainActivity.this,Main2Activity.class));
            }
        });
        web_map = (WebView) findViewById(R.id.webview_map);

        web_map.getSettings().setJavaScriptEnabled(true);
        web_map.setImportantForAccessibility(5);
        web_map.setInitialScale(100);

        web_map.loadUrl(HTML_PAGE);
        //   FrameLayout frameLayout = (FrameLayout) findViewById(R.id.frame_container);
        // LinearLayout viewById = (LinearLayout) findViewById(R.id.largeLabel);
        setSupportActionBar(toolbar);


        //get the widths in px for the first and second panel
        int firstWidth = (int) convertDpToPixel(300, this);
        int secondWidth = (int) convertDpToPixel(72, this);
//
//        crossFader = new Crossfader()
//                .withContent(findViewById(R.id.crossfade_content))
//                .withFirst(frameLayout, firstWidth)
//                .withSecond(viewById, secondWidth)
//                .withSavedInstance(savedInstanceState)
//                .build();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
