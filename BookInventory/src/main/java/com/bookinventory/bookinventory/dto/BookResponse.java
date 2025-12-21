package com.bookinventory.bookinventory.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.bookinventory.bookinventory.model.Category;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response payload containing book details")
public class BookResponse {
    @Schema(description = "Unique identifier of the book", example = "1")
    private Long id;

    @Schema(description = "Title of the book", example = "Clean Code")
    private String title;

    @Schema(description = "Author of the book", example = "Robert C. Martin")
    private String author;

    @Schema(description = "ISBN of the book", example = "978-0132350884")
    private String isbn;

    @Schema(description = "Price of the book", example = "29.99")
    private BigDecimal price;

    @Schema(description = "Year the book was published", example = "2008")
    private Integer publishedYear;

    @Schema(description = "Category of the book", example = "TECHNOLOGY")
    private Category category;

    @Schema(description = "Timestamp when the book was created")
    private Instant createdAt;

    @Schema(description = "Timestamp when the book was last updated")
    private Instant updatedAt;

    @Schema(description = "Publisher of the book", example = "Prentice Hall")
    private String publisher;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getPublishedYear() {
        return publishedYear;
    }

    public void setPublishedYear(Integer publishedYear) {
        this.publishedYear = publishedYear;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }
}
