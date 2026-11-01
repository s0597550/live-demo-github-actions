package de.htw.kbe.tasks;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Eine Aufgabe auf dem Board. Die Validierung findet serverseitig statt.
 */
public record Task(
        Long id,
        @NotBlank(message = "Titel darf nicht leer sein")
        @Size(max = 80, message = "Titel darf höchstens 80 Zeichen haben")
        String title,
        boolean done) {

    public Task withId(long newId) {
        return new Task(newId, title, done);
    }
}
