package com.bookinventory.bookinventory.service;

import java.util.List;

import com.bookinventory.bookinventory.dto.BookRequest;
import com.bookinventory.bookinventory.dto.BookResponse;

public interface BookService {
    BookResponse addBook(BookRequest request);
    BookResponse getBookById(Long bookId);
    List<BookResponse> getAllBooks();
    BookResponse updateBook(Long bookId, BookRequest request);
    void deleteBook(Long bookId);
}
