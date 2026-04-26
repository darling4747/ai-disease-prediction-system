package com.example.hospital.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "hospitals")
public class Hospital {
    @Id
    private String id;
    private String name;
    private String location;
    private String address;
    private String phone;
    private String email;
    private String hours;
    private double rating;
    private List<String> services;
    private List<String> specialties;
    private List<String> departments;
    private double latitude;
    private double longitude;
    private boolean emergencyServices;
    private int bedCapacity;

    public Hospital() {}

    public Hospital(String name, String location, String address, String phone, String email, 
                   String hours, double rating, List<String> services, List<String> specialties, List<String> departments,
                   double latitude, double longitude, boolean emergencyServices, int bedCapacity) {
        this.name = name;
        this.location = location;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.hours = hours;
        this.rating = rating;
        this.services = services;
        this.specialties = specialties;
        this.departments = departments;
        this.latitude = latitude;
        this.longitude = longitude;
        this.emergencyServices = emergencyServices;
        this.bedCapacity = bedCapacity;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getHours() { return hours; }
    public void setHours(String hours) { this.hours = hours; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public List<String> getServices() { return services; }
    public void setServices(List<String> services) { this.services = services; }

    public List<String> getSpecialties() { return specialties; }
    public void setSpecialties(List<String> specialties) { this.specialties = specialties; }

    public List<String> getDepartments() { return departments; }
    public void setDepartments(List<String> departments) { this.departments = departments; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public boolean isEmergencyServices() { return emergencyServices; }
    public void setEmergencyServices(boolean emergencyServices) { this.emergencyServices = emergencyServices; }

    public int getBedCapacity() { return bedCapacity; }
    public void setBedCapacity(int bedCapacity) { this.bedCapacity = bedCapacity; }
}
