package com.example.hospital.config;

import com.example.hospital.model.Doctor;
import com.example.hospital.model.Hospital;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Override
    public void run(String... args) {
        seedHospitals();
        seedDoctors();
    }

    private void seedHospitals() {
        if (hospitalRepository.count() == 0) {
            System.out.println("Seeding hospitals...");
            
            List<Hospital> hospitals = Arrays.asList(
                createHospital("City General Hospital", "New York", "123 Main Street, Downtown", "+1-555-0101", "info@citygeneral.com",
                    "24/7", 4.5, 
                    Arrays.asList("Emergency", "General Medicine", "Surgery"),
                    Arrays.asList("Cardiology", "Neurology", "Pediatrics", "Orthopedics"),
                    Arrays.asList("Emergency", "Cardiac Care", "Neurology", "Pediatrics"),
                    40.7128, -74.0060, true, 500),
                
                createHospital("Heart Care Center", "New York", "456 Medical Drive, Medical District", "+1-555-0102", "info@heartcare.com",
                    "08:00-20:00", 4.8,
                    Arrays.asList("Cardiac Surgery", "Heart Transplant", "ECG"),
                    Arrays.asList("Cardiology", "Cardiac Surgery", "Interventional Cardiology"),
                    Arrays.asList("Cardiology"),
                    40.7589, -73.9851, true, 200),
                
                createHospital("Neurology Institute", "New York", "789 University Avenue, University Area", "+1-555-0103", "info@neuroinst.com",
                    "08:00-18:00", 4.6,
                    Arrays.asList("Brain Surgery", "Spine Surgery", "Neurological Rehab"),
                    Arrays.asList("Neurology", "Neurosurgery", "Psychiatry"),
                    Arrays.asList("Neurology", "Neurosurgery"),
                    40.8075, -73.9626, false, 150)
            );
            
            hospitalRepository.saveAll(hospitals);
            System.out.println("Seeded " + hospitals.size() + " hospitals");
        }
    }

    private void seedDoctors() {
        if (doctorRepository.count() == 0) {
            System.out.println("Seeding doctors...");
            
            // Get hospitals to assign doctors
            List<Hospital> hospitals = hospitalRepository.findAll();
            if (hospitals.isEmpty()) {
                System.out.println("No hospitals found, cannot seed doctors");
                return;
            }
            
            String cityGeneralId = hospitals.get(0).getId();
            String heartCareId = hospitals.get(1).getId();
            String neuroId = hospitals.get(2).getId();

            List<Doctor> doctors = Arrays.asList(
                createDoctor("Dr. Sarah Johnson", "Cardiologist", "Cardiology", 15, 
                    heartCareId, "Heart Care Center", 4.8, "MD", 
                    Arrays.asList("MD", "Interventional Cardiology"), "Tomorrow 9:00 AM", "$150",
                    Arrays.asList("English", "Spanish"), true),
                
                createDoctor("Dr. Michael Chen", "Neurologist", "Neurology", 12,
                    neuroId, "Neurology Institute", 4.9, "MD, PhD",
                    Arrays.asList("MD", "PhD", "Stroke Specialist"), "Tomorrow 10:00 AM", "$200",
                    Arrays.asList("English", "Mandarin"), true),
                
                createDoctor("Dr. Emily Davis", "Pediatrician", "Pediatrics", 10,
                    cityGeneralId, "City General Hospital", 4.7, "MD",
                    Arrays.asList("MD", "Pediatric Care"), "Tomorrow 11:00 AM", "$100",
                    Arrays.asList("English", "Spanish"), true),
                
                createDoctor("Dr. Robert Wilson", "Orthopedic Surgeon", "Orthopedics", 18,
                    cityGeneralId, "City General Hospital", 4.6, "MD, FRCS",
                    Arrays.asList("MD", "FRCS", "Joint Replacement"), "Tomorrow 2:00 PM", "$250",
                    Arrays.asList("English"), true),
                
                createDoctor("Dr. Jennifer Martinez", "Dermatologist", "Dermatology", 8,
                    cityGeneralId, "City General Hospital", 4.5, "MD",
                    Arrays.asList("MD", "Cosmetic Dermatology"), "Tomorrow 3:00 PM", "$120",
                    Arrays.asList("English", "Spanish"), true),
                
                createDoctor("Dr. David Thompson", "General Physician", "General Medicine", 20,
                    heartCareId, "Heart Care Center", 4.7, "MD",
                    Arrays.asList("MD", "Family Medicine"), "Tomorrow 9:30 AM", "$80",
                    Arrays.asList("English"), true),
                
                createDoctor("Dr. Amanda White", "Gynecologist", "Gynecology", 14,
                    cityGeneralId, "City General Hospital", 4.8, "MD, FACOG",
                    Arrays.asList("MD", "FACOG", "Women's Health"), "Tomorrow 1:00 PM", "$180",
                    Arrays.asList("English", "Spanish"), true),
                
                createDoctor("Dr. James Brown", "Psychiatrist", "Psychiatry", 16,
                    neuroId, "Neurology Institute", 4.6, "MD",
                    Arrays.asList("MD", "Mental Health"), "Not Available", "$200",
                    Arrays.asList("English"), false)
            );
            
            doctorRepository.saveAll(doctors);
            System.out.println("Seeded " + doctors.size() + " doctors");
        }
    }

    private Hospital createHospital(String name, String location, String address, String phone, String email, 
                                     String hours, double rating, List<String> services, List<String> specialties, List<String> departments,
                                     double latitude, double longitude, boolean emergencyServices, int bedCapacity) {
        Hospital hospital = new Hospital();
        hospital.setName(name);
        hospital.setLocation(location);
        hospital.setAddress(address);
        hospital.setPhone(phone);
        hospital.setEmail(email);
        hospital.setHours(hours);
        hospital.setRating(rating);
        hospital.setServices(services);
        hospital.setSpecialties(specialties);
        hospital.setDepartments(departments);
        hospital.setLatitude(latitude);
        hospital.setLongitude(longitude);
        hospital.setEmergencyServices(emergencyServices);
        hospital.setBedCapacity(bedCapacity);
        return hospital;
    }

    private Doctor createDoctor(String name, String specialization, String department, 
                                 int experience, String hospitalId, String hospitalName,
                                 double rating, String education, List<String> qualifications,
                                 String nextAvailable, String consultationFee, List<String> languages,
                                 boolean acceptingNewPatients) {
        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setSpecialization(specialization);
        doctor.setDepartment(department);
        doctor.setExperience(experience);
        doctor.setHospitalId(hospitalId);
        doctor.setHospital(hospitalName);
        doctor.setRating(rating);
        doctor.setEducation(education);
        doctor.setQualifications(qualifications);
        doctor.setNextAvailable(nextAvailable);
        doctor.setConsultationFee(consultationFee);
        doctor.setLanguages(languages);
        doctor.setAcceptingNewPatients(acceptingNewPatients);
        // Set default phone and email
        doctor.setPhone("+1-555-0000");
        doctor.setEmail(name.toLowerCase().replace(" ", ".") + "@hospital.com");
        return doctor;
    }
}
