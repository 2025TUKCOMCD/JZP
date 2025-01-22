package com.example.jzp.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID movieId;

    private String movieImage;
    private String movieName;
    private String movieType;
    private String movieRating;
    private Date movieTime;
    private int movieSeatRemain;
    private String movieTheater;

    @Temporal(TemporalType.DATE)
    private Date movieCalendar;

    // Getters and Setters
    public UUID getMovieId() {
        return movieId;
    }

    public void setMovieId(UUID movieId) {
        this.movieId = movieId;
    }

    public String getMovieImage() {
        return movieImage;
    }

    public void setMovieImage(String movieImage) {
        this.movieImage = movieImage;
    }

    public String getMovieName() {
        return movieName;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public String getMovieType() {
        return movieType;
    }

    public void setMovieType(String movieType) {
        this.movieType = movieType;
    }

    public String getMovieRating() {
        return movieRating;
    }

    public void setMovieRating(String movieRating) {
        this.movieRating = movieRating;
    }

    public Date getMovieTime() {
        return movieTime;
    }

    public void setMovieTime(Date movieTime) {
        this.movieTime = movieTime;
    }

    public int getMovieSeatRemain() {
        return movieSeatRemain;
    }

    public void setMovieSeatRemain(int movieSeatRemain) {
        this.movieSeatRemain = movieSeatRemain;
    }

    public String getMovieTheater() {
        return movieTheater;
    }

    public void setMovieTheater(String movieTheater) {
        this.movieTheater = movieTheater;
    }

    public Date getMovieCalendar() {
        return movieCalendar;
    }

    public void setMovieCalendar(Date movieCalendar) {
        this.movieCalendar = movieCalendar;
    }
}
