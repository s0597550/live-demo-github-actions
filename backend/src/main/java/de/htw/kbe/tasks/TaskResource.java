package de.htw.kbe.tasks;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;

@Path("/api/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TaskResource {

    @Inject
    TaskService service;

    @GET
    public List<Task> list() {
        return service.findAll();
    }

    @POST
    public Response create(@Valid Task task) {
        Task saved = service.create(task);
        return Response.status(Response.Status.CREATED).entity(saved).build();
    }

    @GET
    @Path("/stats")
    public Map<String, Long> stats() {
        return Map.of("open", service.countOpen());
    }
}
