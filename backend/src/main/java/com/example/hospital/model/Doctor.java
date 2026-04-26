package com.example.hospital.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "doctors")
public class Doctor {
    @Id
    private String id;
    private String name;
    private String specialization;
    private String department;
    private String hospitalId;
    private String hospital;
    private String phone;
    private String email;
    private int experience;
    private double rating;
    private String education;
    private List<String> qualifications;
    private String nextAvailable;
    private String consultationFee;
    private List<String> languages;
    private boolean acceptingNewPatients;

    public Doctor() {}

    public Doctor(String name, String specialization, String department, String hospitalId, String hospital, String phone, 
                 String email, int experience, double rating, String education, 
                 List<String> qualifications, String nextAvailable, String consultationFee,
                 List<String> languages, boolean acceptingNewPatients) {
        this.name = name;
        this.specialization = specialization;
        this.department = department;
        this.hospitalId = hospitalId;
        this.hospital = hospital;
        this.phone = phone;
        this.email = email;
        this.experience = experience;
        this.rating = rating;
        this.education = education;
        this.qualifications = qualifications;
        this.nextAvailable = nextAvailable;
        this.consultationFee = consultationFee;
        this.languages = languages;
        this.acceptingNewPatients = acceptingNewPatients;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getHospitalId() { return hospitalId; }
    public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

    public String getHospital() { return hospital; }
    public void setHospital(String hospital) { this.hospital = hospital; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getExperience() { return experience; }
    public void setExperience(int experience) { this.experience = experience; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public List<String> getQualifications() { return qualifications; }
    public void setQualifications(List<String> qualifications) { this.qualifications = qualifications; }

    public String getNextAvailable() { return nextAvailable; }
    public void setNextAvailable(String nextAvailable) { this.nextAvailable = nextAvailable; }

    public String getConsultationFee() { return consultationFee; }
    public void setConsultationFee(String consultationFee) { this.consultationFee = consultationFee; }

    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }

    public boolean isAcceptingNewPatients() { return acceptingNewPatients; }
    public void setAcceptingNewPatients(boolean acceptingNewPatients) { this.acceptingNewPatients = acceptingNewPatients; }
}
