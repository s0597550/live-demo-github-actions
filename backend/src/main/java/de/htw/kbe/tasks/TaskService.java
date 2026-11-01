package de.htw.kbe.tasks;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Geschäftslogik. Für die Demo bewusst ohne Datenbank (In-Memory),
 * damit die CI-Pipeline ohne externe Dienste läuft.
 */
@ApplicationScoped
public class TaskService {

    private final Map<Long, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong();

    public List<Task> findAll() {
        List<Task> all = new ArrayList<>(tasks.values());
        all.sort((a, b) -> Long.compare(a.id(), b.id()));
        return all;
    }

    public Task create(Task task) {
        Task saved = task.withId(sequence.incrementAndGet());
        tasks.put(saved.id(), saved);
        return saved;
    }

    public long countOpen() {
        return tasks.values().stream().filter(t -> !t.done()).count();
    }

    public void clear() {
        tasks.clear();
    }
}
