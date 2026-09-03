package com.dineflow.order.exception;

public class TableAlreadyReservedException extends RuntimeException {

    public TableAlreadyReservedException(String message) {
        super(message);
    }
}