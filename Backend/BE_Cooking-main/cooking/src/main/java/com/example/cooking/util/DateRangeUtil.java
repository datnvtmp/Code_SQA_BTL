package com.example.cooking.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.stereotype.Component;

@Component
public class DateRangeUtil {

    /**
     * Trả về mảng gồm [startDate, endDate] dạng LocalDateTime
     */
    public LocalDateTime[] getRange(int daysBack) {
        LocalDate today = LocalDate.now();

        LocalDate start = today.minusDays(daysBack);
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = today.atTime(LocalTime.MAX);

        return new LocalDateTime[] { startDateTime, endDateTime };
    }
}

