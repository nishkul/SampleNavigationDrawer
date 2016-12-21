package com.android.sample;

import android.content.Context;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class Main2Activity extends AppCompatActivity {
    WebView myBrowser;
    EditText Msg;
    Button btnSendMsg;
    MyJavaScriptInterface myJavaScriptInterface;

    /**
     * Called when the activity is first created.
     */

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        myBrowser = (WebView) findViewById(R.id.mybrowser);

//        final MyJavaScriptInterface myJavaScriptInterface
//                = new MyJavaScriptInterface(this);

        myJavaScriptInterface = new MyJavaScriptInterface(this);

        myBrowser.addJavascriptInterface(myJavaScriptInterface, "javaObject");

        myBrowser.getSettings().setJavaScriptEnabled(true);
        myBrowser.loadUrl("file:///android_asset/page.html");

        Msg = (EditText) findViewById(R.id.msg);
        btnSendMsg = (Button) findViewById(R.id.sendmsg);
        btnSendMsg.setOnClickListener(new Button.OnClickListener() {

            @Override
            public void onClick(View arg0) {
                // TODO Auto-generated method stub
                String msgToSend = Msg.getText().toString();
                myBrowser.loadUrl("javascript:callFromActivity(\"" + msgToSend + "\")");
                myJavaScriptInterface.setData("manish");
            }
        });

    }

    public class MyJavaScriptInterface {
        Context mContext;
        String data;

       // temp="{data:'happy'}";

        MyJavaScriptInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public String getData() {
            return data;
        }

        @JavascriptInterface
        public void setData(String data) {
            this.data = data;
        }

        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void openAndroidDialog() {
            AlertDialog.Builder myDialog
                    = new AlertDialog.Builder(Main2Activity.this);
            myDialog.setTitle("DANGER!");
            myDialog.setMessage("You can do what you want!");
            myDialog.setPositiveButton("ON", null);
            myDialog.show();
        }

        @JavascriptInterface
        public void data() {
            AlertDialog.Builder myDialog
                    = new AlertDialog.Builder(Main2Activity.this);
            myDialog.setTitle("DANGER!");
            myDialog.setMessage("You can do what you want!");
            myDialog.setPositiveButton("ON", null);
            myDialog.show();
        }
    }
}
