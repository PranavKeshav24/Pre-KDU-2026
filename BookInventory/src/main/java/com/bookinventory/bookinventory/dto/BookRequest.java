package com.bookinventory.bookinventory.dto;

import java.math.BigDecimal;

import com.bookinventory.bookinventory.model.Category;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request payload for creating or updating a book")
public class BookRequest {
    @Schema(description = "Title of the book", example = "Clean Code", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Title is required!")
    private String title;

    @Schema(description = "Author of the book", example = "Robert C. Martin", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Author is required!")
    private String author;

    @Schema(description = "ISBN of the book", example = "978-0132350884")
    private String isbn;

    @Schema(description = "Publisher of the book", example = "Prentice Hall")
    private String publisher;

    @Schema(description = "Price of the book", example = "29.99", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Price is required!")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @Schema(description = "Year the book was published", example = "2008")
    private Integer publishedYear;

    @Schema(description = "Category of the book", example = "TECHNOLOGY")
    private Category category;

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

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }
}
