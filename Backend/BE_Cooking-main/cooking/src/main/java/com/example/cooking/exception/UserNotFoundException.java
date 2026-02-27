package com.example.cooking.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id){
        super("User with " + id + " is not found !");
    }
    public UserNotFoundException(){
        super("User " + "is not found !");
    }
}
