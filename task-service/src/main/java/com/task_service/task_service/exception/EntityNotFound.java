package com.task_service.task_service.exception;

public class EntityNotFound extends RuntimeException{

    private String entityName;
    private String fieldName;
    private Object value;

    public EntityNotFound(String entityName, String fieldName, Object value){
        super(String.format("%s is not found with %s : %s", entityName, fieldName, value));
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.value = value;
    }

}
