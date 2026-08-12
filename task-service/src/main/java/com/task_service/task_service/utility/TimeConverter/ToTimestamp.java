package com.task_service.task_service.utility.TimeConverter;

import jakarta.annotation.Nullable;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class ToTimestamp implements TimeConvert{
    @Override
    public String convert(@Nullable LocalDate localDate, @Nullable LocalDateTime localDateTime, @Nullable LocalTime localTime) {
        Timestamp timestamp = null;
        if (localDate != null) {
            timestamp = Timestamp.from(Instant.from(localDate));
        } else if (localTime != null) {
            timestamp = Timestamp.from(Instant.from(localTime));
        } else if (localDateTime != null) {
            timestamp = Timestamp.from(Instant.from(localDateTime));
        }
        assert timestamp != null;
        return timestamp.toString();
    }
}
