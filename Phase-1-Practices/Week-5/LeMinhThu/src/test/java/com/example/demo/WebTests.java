package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(controllers = WebController.class)
public class WebTests {
    @Autowired
    private MockMvc mockMvc;
    

    @Test
    public void inddexTest() throws Exception {
        mockMvc.perform(get("/")).andExpect(status().isOk())
                .andExpect(view().name("index"))
                .andExpect(content().string(containsString("Đây là một trang web")));

    }

    @Test
    public void aboutTest() throws Exception {
        mockMvc.perform(get("/about")).andExpect(status().isOk())
                .andExpect(view().name("about"))
                .andExpect(content().string(containsString("Email")));
    }

    @Test
    public void helloTest() throws Exception {
        mockMvc.perform(get("/hello").param("name", "abc"))
                .andExpect(status().isOk())
                .andExpect(view().name("hello"))
                .andExpect(content().string(containsString("Trang chủ")))
                .andExpect(model().attribute("name",equalTo("abc")))
                .andExpect(content().string(containsString("Hello, abc")));                        
                
    }
  
    
	
}
