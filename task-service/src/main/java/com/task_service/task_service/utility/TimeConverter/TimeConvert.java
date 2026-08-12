package com.task_service.task_service.utility.TimeConverter;

import jakarta.annotation.Nullable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public interface TimeConvert {
    String convert(@Nullable LocalDate localDate, @Nullable LocalDateTime localDateTime, @Nullable LocalTime localTime);
}
