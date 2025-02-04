package com.example.jzp.model;

import java.time.LocalTime;
import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
public class Movie {

    @Id
    @GeneratedValue
    private UUID movieId;

    private String movieName;

    @Temporal(TemporalType.DATE)
    private Date movieCalendar;
    private LocalTime movieTime;
    private String movieTheater;
    private String movieImage;
    private String movieType;
    private String movieRating;
    private int movieSeatRemain;


    public UUID getMovieId() {
        return movieId;
    }

    public void setMovieId(UUID movieId) {
        this.movieId = movieId;
    }

    public String getMovieName() {
        return movieName;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public Date getMovieCalendar() {
        return movieCalendar;
    }

    public void setMovieCalendar(Date movieCalendar) {
        this.movieCalendar = movieCalendar;
    }

    public LocalTime getMovieTime() {
        return movieTime;
    }

    public void setMovieTime(LocalTime movieTime) {
        this.movieTime = movieTime;
    }

    public String getMovieTheater() {
        return movieTheater;
    }

    public void setMovieTheater(String movieTheater) {
        this.movieTheater = movieTheater;
    }

    public String getMovieImage() {
        return movieImage;
    }

    public void setMovieImage(String movieImage) {
        this.movieImage = movieImage;
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

    public int getMovieSeatRemain() {
        return movieSeatRemain;
    }

    public void setMovieSeatRemain(int movieSeatRemain) {
        this.movieSeatRemain = movieSeatRemain;
    }
}
