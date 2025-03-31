package com.example.jzp.model;

import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.Date;
import java.util.UUID;

@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID ticketId;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;
    @Column(nullable = false)
    private String movieTheater;
    private String movieTime;
    private String movieSeat;
    private int customerDisabled;
    private int customerYouth;
    private int customerAdult;
    private int customerOld;
    private String phoneNumber;

    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

    // Getter & Setter 추가
    public UUID getTicketId() {
        return ticketId;
    }

    public void setTicketId(UUID ticketId) {
        this.ticketId = ticketId;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public String getMovieTime() {
        return movieTime;
    }

    public void setMovieTime(String movieTime) {
        this.movieTime = movieTime;
    }

    public String getMovieSeat() {
        return movieSeat;
    }

    public void setMovieSeat(String movieSeat) {
        this.movieSeat = movieSeat;
    }

    public String getMovieTheater() {
        return movieTheater;
    }

    public void setMovieTheater(String movieTheater) {
        this.movieTheater = movieTheater;
    }

    public int getCustomerDisabled() {
        return customerDisabled;
    }

    public void setCustomerDisabled(int customerDisabled) {
        this.customerDisabled = customerDisabled;
    }

    public int getCustomerYouth() {
        return customerYouth;
    }

    public void setCustomerYouth(int customerYouth) {
        this.customerYouth = customerYouth;
    }

    public int getCustomerAdult() {
        return customerAdult;
    }

    public void setCustomerAdult(int customerAdult) {
        this.customerAdult = customerAdult;
    }

    public int getCustomerOld() {
        return customerOld;
    }

    public void setCustomerOld(int customerOld) {
        this.customerOld = customerOld;
    }
    public Date getCreatedAt() {
        return createdAt;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
