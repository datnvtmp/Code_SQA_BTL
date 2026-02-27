package com.example.cooking.common;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * A generic DTO wrapper for paginated data.
 * Provides a clean, controllable structure for API responses,
 * avoiding exposure of internal Spring Data Page details.
 *
 * @param <T> the type of elements in the page
 */
public class PageDTO<T> {

    private List<T> content; // Danh sách dữ liệu của trang hiện tại
    private long totalElements; // Tổng số phần tử (toàn bộ)
    private int totalPages; // Tổng số trang
    private int pageNumber; // Trang hiện tại (0-based)
    private int pageSize; // Kích thước của mỗi trang
    private boolean hasNext; // Có trang kế tiếp hay không
    private boolean hasPrevious; // Có trang trước đó hay không

    // --------------------------------------------------
    // Constructors
    // --------------------------------------------------

    // ⚙️ Constructor mặc định (cần thiết cho Jackson)
    public PageDTO() {
    }

    // ⚙️ Constructor đầy đủ
    public PageDTO(List<T> content, long totalElements, int totalPages, int pageNumber,
            int pageSize, boolean hasNext, boolean hasPrevious) {
        this.content = content;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
    }

    // ⚙️ Constructor nhận trực tiếp Page<T>
    public PageDTO(Page<T> page) {
        this.content = page.getContent();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.pageNumber = page.getNumber();
        this.pageSize = page.getSize();
        this.hasNext = page.hasNext();
        this.hasPrevious = page.hasPrevious();
    }

    // ⚙️ Constructor dùng khi bạn có content đã map riêng (entity → DTO)
    public PageDTO(Page<?> page, List<T> mappedContent) {
        this.content = mappedContent;
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.pageNumber = page.getNumber();
        this.pageSize = page.getSize();
        this.hasNext = page.hasNext();
        this.hasPrevious = page.hasPrevious();
    }

    public static <T> PageDTO<T> empty(Pageable pageable) {
        return new PageDTO<>(
                List.of(), // content rỗng
                0, // totalElements
                0, // totalPages
                pageable.getPageNumber(),
                pageable.getPageSize(),
                false, // hasNext
                false // hasPrevious
        );
    }

    // --------------------------------------------------
    // Getters & Setters
    // --------------------------------------------------

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public boolean isHasNext() {
        return hasNext;
    }

    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }

    public boolean isHasPrevious() {
        return hasPrevious;
    }

    public void setHasPrevious(boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }
}
