package com.mycompany.app;


import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

/**
 * Hello world!
 */
public class App
{

    private final String message = "Hello";

    public App() {}


    public static void main(String[] args) throws Exception {
    	System.out.println("Welcome My Jenkins Java Sever port 8000!");
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
        server.createContext("/test", new MyHandler());
        server.setExecutor(null); // creates a default executor
        server.start();
    }

    static class MyHandler implements HttpHandler {
        public static String response_mess = "Hello";
        @Override
        public void handle(HttpExchange t) throws IOException {
            String response = response_mess;
            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
        public String messResponse(){
            return response_mess;
        }
    }


}
