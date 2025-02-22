package com.example.jzp.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
public class TMDB {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long tmdbMovieId;  // TMDB 영화 ID
    private String title;  // 영화 제목
    private String posterPath;  // 영화 포스터 경로
    private Integer ranking;  // 영화 순위
    private String ageRating;  // 영화 등급
    @ElementCollection
    private List<String> genres;  // 영화 장르

    public Long getId() {
        return id;
    }

    public void setId(Long Id) {
        this.id = id;
    }

    public Long getTmdbMovieId() {
        return tmdbMovieId;
    }

    public void setTmdbMovieId(Long tmdbMovieId) {
        this.tmdbMovieId = tmdbMovieId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public Integer getRanking() {
        return ranking;
    }

    public void setRanking(Integer ranking) {
        this.ranking = ranking;
    }

    public String getAgeRating() {
        return ageRating;
    }

    public void setAgeRating(String ageRating) {
        this.ageRating = ageRating;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }
}
