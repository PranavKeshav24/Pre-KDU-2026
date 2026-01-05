package com.bookinventory.bookinventory.service;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.bookinventory.bookinventory.dto.BookRequest;
import com.bookinventory.bookinventory.exception.ResourceNotFoundException;
import com.bookinventory.bookinventory.model.Book;
import com.bookinventory.bookinventory.repository.BookRepository;

public class BookServiceTest {
    @Mock private BookRepository repo;
    @InjectMocks private BookServiceImpl service;

    @BeforeEach
    void init() { MockitoAnnotations.openMocks(this); }

    @Test
    void shouldAddBookSuccessfully() {
        BookRequest req = new BookRequest();
        req.setTitle("Clean Code");
        req.setAuthor("Robert Martin");
        req.setPrice(new BigDecimal("29.99"));
        when(repo.findByIsbn(null)).thenReturn(Optional.empty());

        Book saved = new Book();
        saved.setId(1L);
        saved.setTitle(req.getTitle());
        saved.setAuthor(req.getAuthor());
        saved.setPrice(req.getPrice());
        when(repo.save(any(Book.class))).thenReturn(saved);

        var resp = service.addBook(req);
        assertNotNull(resp);
        assertEquals(1L, resp.getId());
        verify(repo, times(1)).save(any(Book.class));
    }

    @Test
    void shouldGetBookByIdSuccessfully() {
        Book b = new Book();
        b.setId(2L);
        b.setTitle("Test");
        when(repo.findById(2L)).thenReturn(Optional.of(b));
        var resp = service.getBookById(2L);
        assertEquals(2L, resp.getId());
    }

    @Test
    void getBookByIdFailure() {
        when(repo.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getBookById(99L));
    }

    @Test
    void duplicateIsbnExceptionThrown() {
        BookRequest req = new BookRequest();
        req.setTitle("A");
        req.setAuthor("B");
        req.setIsbn("ISBN-123");
        req.setPrice(new BigDecimal("1.00"));
        when(repo.findByIsbn("ISBN-123")).thenReturn(Optional.of(new Book()));
        assertThrows(ResourceNotFoundException.class, () -> service.addBook(req));
    }
}
