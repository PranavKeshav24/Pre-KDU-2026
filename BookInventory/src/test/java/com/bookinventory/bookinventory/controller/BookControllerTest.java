package com.bookinventory.bookinventory.controller;

import com.bookinventory.bookinventory.dto.BookRequest;
import com.bookinventory.bookinventory.dto.BookResponse;
import com.bookinventory.bookinventory.service.BookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import tools.jackson.databind.ObjectMapper;
import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@WebMvcTest(BookController.class)
public class BookControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private BookService service;

    @Autowired
    private ObjectMapper mapper;

    @Test
    void postAddBook_returnsCreated() throws Exception {
        BookRequest req = new BookRequest();
        req.setTitle("T");
        req.setAuthor("A");
        req.setPrice(new BigDecimal("9.99"));

        BookResponse resp = new BookResponse();
        resp.setId(10L);
        resp.setTitle("T");

        when(service.addBook(any(BookRequest.class))).thenReturn(resp);

        mvc.perform(post("/api/books")
                        .contentType(APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void getBookFound_returnsOk() throws Exception {
        BookResponse r = new BookResponse();
        r.setId(5L);
        r.setTitle("X");
        when(service.getBookById(5L)).thenReturn(r);

        mvc.perform(get("/api/books/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5));
    }
}
