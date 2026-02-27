package com.example.cooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.cooking.model.OutBoxEvent;

@Repository
public interface OutBoxEventRepository extends JpaRepository<OutBoxEvent, Long> {
     List<OutBoxEvent> findTop100ByProcessedFalseOrderByCreatedAtAsc();
}
