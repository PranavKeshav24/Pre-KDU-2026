package com.bookinventory.bookinventory.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookinventory.bookinventory.dto.BookRequest;
import com.bookinventory.bookinventory.dto.BookResponse;
import com.bookinventory.bookinventory.exception.ResourceNotFoundException;
import com.bookinventory.bookinventory.model.Book;
import com.bookinventory.bookinventory.repository.BookRepository;

@Service
@Transactional
public class BookServiceImpl implements BookService {
    private final  BookRepository bookRepository;
    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public BookResponse addBook(BookRequest bookRequest) {
        bookRequest.setIsbn((bookRequest.getIsbn() == null || bookRequest.getIsbn().isBlank()) ? null : bookRequest.getIsbn());
        if(bookRequest.getIsbn() != null && bookRepository.findByIsbn(bookRequest.getIsbn()).isPresent()) {
            throw new ResourceNotFoundException("Book already exists");
        }

        Book book = new Book();
        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setIsbn(bookRequest.getIsbn());
        book.setPrice(bookRequest.getPrice());
        book.setPublicationYear(bookRequest.getPublishedYear());
        book.setPublisher(bookRequest.getPublisher());
        book.setCategory(bookRequest.getCategory());

        Book savedBook = bookRepository.save(book);
        return toResponse(savedBook);
    }

    @Override
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        return toResponse(book);
    }

    @Override
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookResponse updateBook(Long id, BookRequest bookRequest) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setIsbn((bookRequest.getIsbn() == null || bookRequest.getIsbn().isBlank()) ? null : bookRequest.getIsbn());
        book.setPrice(bookRequest.getPrice());
        book.setPublicationYear(bookRequest.getPublishedYear());
        book.setPublisher(bookRequest.getPublisher());
        book.setCategory(bookRequest.getCategory());

        Book updatedBook = bookRepository.save(book);
        return toResponse(updatedBook);
    }

    @Override
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    private BookResponse toResponse(Book book) {
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setIsbn(book.getIsbn());
        response.setTitle(book.getTitle());
        response.setAuthor(book.getAuthor());
        response.setPrice(book.getPrice());
        response.setPublishedYear(book.getPublicationYear());
        response.setPublisher(book.getPublisher());
        response.setCategory(book.getCategory());
        response.setCreatedAt(book.getCreatedAt());
        response.setUpdatedAt(book.getUpdatedAt());
        return response;
    }
}
