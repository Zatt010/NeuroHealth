package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "community")
public class Publicacion {
    @Id
    private String id;

    @DBRef
    private Usuario usuario;

    private String titulo;
    private String contenido;
    private Instant fechaPublicacion;
    private String tema;
    private List<String> comentarioIds = new ArrayList<>();

    public Publicacion(Usuario usuario, String titulo, String contenido, String tema) {
        this.usuario = usuario;
        this.titulo = titulo;
        this.contenido = contenido;
        this.tema = tema;
        this.fechaPublicacion = Instant.now();
    }
}
