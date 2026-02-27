package com.example.cooking.exception;

import java.util.List;

public class DuplicateFieldException extends RuntimeException {
    private List<String> errors;
    public DuplicateFieldException(List<String> errors){
        super("Duplicate field error");
        this.errors = errors;
    }
    public List<String> getErrors() {
        return errors;
    }
}
