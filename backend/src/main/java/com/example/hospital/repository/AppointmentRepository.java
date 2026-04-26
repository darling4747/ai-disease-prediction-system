package com.example.hospital.repository;

import com.example.hospital.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDesc(String patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDesc(String doctorId);
    List<Appointment> findByHospitalIdOrderByAppointmentDateDesc(String hospitalId);
    List<Appointment> findByStatus(String status);
    List<Appointment> findByDoctorIdAndAppointmentDateBetween(String doctorId, LocalDateTime start, LocalDateTime end);
    boolean existsByDoctorIdAndAppointmentDate(String doctorId, LocalDateTime appointmentDate);
}
