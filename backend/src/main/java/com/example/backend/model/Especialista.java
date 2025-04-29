package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Document(collection = "especialistasHorario")
public class Especialista {
    @Id
    private String id;
    private String name;
    private String speciality;
    private List<String> hours;
    private Map<String, List<String>> occupiedHours;


    // Constructores
    public Especialista() {}

    public Especialista(String name, String speciality, List<String> hours, Map<String, List<String>> occupiedHours) {
        this.name = name;
        this.speciality = speciality;
        this.hours = hours;
        this.occupiedHours = occupiedHours;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpeciality() {
        return speciality;
    }

    public void setSpeciality(String speciality) {
        this.speciality = speciality;
    }

    public List<String> getHours() {
        return hours;
    }

    public void setHours(List<String> hours) {
        this.hours = hours;
    }

    public Map<String, List<String>> getOccupiedHours() {
        return occupiedHours;
    }

    public void setOccupiedHours(Map<String, List<String>> occupiedHours) {
        this.occupiedHours = occupiedHours;
    }
}