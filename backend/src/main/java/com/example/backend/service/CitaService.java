package com.example.backend.service;

import com.example.backend.model.Cita;
import com.example.backend.model.Especialista;
import com.example.backend.model.Usuario;
import com.example.backend.repository.CitaRepository;
import com.example.backend.repository.EspecialistaRepository;
import com.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CitaService {
    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    public Cita crearCita(String usuarioId, String especialistaId, String fecha, String hora) {
        // Verificamos si el usuario existe
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));

        // Verificamos si el especialista existe
        Especialista especialista = especialistaRepository.findById(especialistaId)
                .orElseThrow(() -> new RuntimeException("Especialista no encontrado con ID: " + especialistaId));

        // Creamos la cita
        Cita cita = new Cita(usuarioId, especialistaId, fecha, hora);

        // Guardamos la cita
        return citaRepository.save(cita);
    }

    public List<Cita> obtenerCitas() {
        return citaRepository.findAll();
    }

    public List<Cita> obtenerCitasPorUsuario(String usuarioId) {
        return citaRepository.findByUsuarioId(usuarioId);
    }

    public List<Cita> obtenerCitasPorEspecialista(String especialistaId) {
        return citaRepository.findByEspecialistaId(especialistaId);
    }
}
