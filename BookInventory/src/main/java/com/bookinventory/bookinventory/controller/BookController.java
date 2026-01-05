package com.bookinventory.bookinventory.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookinventory.bookinventory.dto.BookRequest;
import com.bookinventory.bookinventory.dto.BookResponse;
import com.bookinventory.bookinventory.service.BookService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Books", description = "Book inventory management APIs")
public class BookController {
    private final BookService service;
    public BookController(BookService service) { this.service = service; }

    @Operation(summary = "Add a new book", description = "Creates a new book in the inventory")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Book created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "409", description = "Book with same ISBN already exists")
    })
    @PostMapping
    public ResponseEntity<BookResponse> addBook(@Valid @RequestBody BookRequest request) {
        BookResponse saved = service.addBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @Operation(summary = "Get a book by ID", description = "Returns a single book by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Book found"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBook(
            @Parameter(description = "ID of the book to retrieve") @PathVariable Long id) {
        BookResponse resp = service.getBookById(id);
        return ResponseEntity.ok(resp);
    }

    @Operation(summary = "Get a book by Author", description = "Returns a list of books by its author")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Book found"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    @GetMapping("/author/{author}")
    public ResponseEntity<List<BookResponse>> getBookByAuthorName(
            @Parameter(description = "Author of the book to retrieve") @PathVariable String author) {
        List<BookResponse> books = service.getBookByAuthor(author);
        return ResponseEntity.ok(books);
    }

    @Operation(summary = "Get all books", description = "Returns a list of all books in the inventory")
    @ApiResponse(responseCode = "200", description = "List of books retrieved successfully")
    @GetMapping
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        List<BookResponse> books = service.getAllBooks();
        return ResponseEntity.ok(books);
    }

    @Operation(summary = "Update a book", description = "Updates an existing book by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Book updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(
            @Parameter(description = "ID of the book to update") @PathVariable Long id,
            @Valid @RequestBody BookRequest request) {
        BookResponse updated = service.updateBook(id, request);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete a book", description = "Deletes a book from the inventory by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Book deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(
            @Parameter(description = "ID of the book to delete") @PathVariable Long id) {
        service.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
