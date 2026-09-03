package com.dineflow.order.exception;

import com.dineflow.order.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

        private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFound(
                        ResourceNotFoundException ex) {

                return buildResponse(
                                HttpStatus.NOT_FOUND,
                                ex.getMessage());
        }

        @ExceptionHandler(InvalidOrderException.class)
        public ResponseEntity<ErrorResponse> handleInvalidOrder(
                        InvalidOrderException ex) {

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                ex.getMessage());
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidation(
                        MethodArgumentNotValidException ex) {

                String message = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                                .collect(Collectors.joining(", "));

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                message);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGeneral(
                        Exception ex) {

                log.error("Unexpected error occurred", ex);
                return buildResponse(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                "An unexpected error occurred");
        }

        private ResponseEntity<ErrorResponse> buildResponse(
                        HttpStatus status,
                        String message) {

                ErrorResponse response = new ErrorResponse(
                                status.value(),
                                message,
                                LocalDateTime.now());

                return ResponseEntity
                                .status(status)
                                .body(response);
        }

        @ExceptionHandler(TableAlreadyReservedException.class)
        public ResponseEntity<ErrorResponse> handleTableAlreadyReserved(
                        TableAlreadyReservedException ex) {
                
                ErrorResponse response = new ErrorResponse(
                                HttpStatus.CONFLICT.value(),
                                ex.getMessage(),
                                LocalDateTime.now());

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(response);
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ErrorResponse> handleIllegalArgument(
                        IllegalArgumentException ex) {

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                ex.getMessage());
        }
}