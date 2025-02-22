package com.example.jzp.repository;

import com.example.jzp.model.TMDB;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TMDBRepository extends JpaRepository<TMDB, Long> {
    Optional<TMDB> findById(Long id);
}
