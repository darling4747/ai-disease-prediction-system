package com.example.hospital.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Handle structured input validation errors (DTO annotations)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();
        logger.error("Validation error at path: {}", path, ex);

        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Input validation failed. Please check the provided fields.",
                path
        );

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            apiError.addValidationError(fieldName, errorMessage);
        });

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    // Handle generic IllegalArgumentException (bad requests)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();
        logger.error("Illegal argument error at path: {}", path, ex);

        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                ex.getMessage(),
                path
        );

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    // Handle generic Security AccessDeniedException
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDeniedException(
            org.springframework.security.access.AccessDeniedException ex, WebRequest request) {
        
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();
        logger.error("Access denied error at path: {}", path, ex);

        ApiError apiError = new ApiError(
                HttpStatus.FORBIDDEN.value(),
                HttpStatus.FORBIDDEN.getReasonPhrase(),
                "Access Denied: You do not have permissions to access this resource.",
                path
        );

        return new ResponseEntity<>(apiError, HttpStatus.FORBIDDEN);
    }

    // Fallback for all other unhandled internal server exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGlobalExceptions(
            Exception ex, WebRequest request) {
        
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();
        logger.error("Internal Server Error at path: {}", path, ex);

        ApiError apiError = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "An unexpected internal error occurred on the server.",
                path
        );

        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
