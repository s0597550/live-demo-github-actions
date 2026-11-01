package de.htw.kbe.tasks;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class TaskResourceTest {

    @Inject
    TaskService service;

    @BeforeEach
    void reset() {
        service.clear();
    }

    @Test
    void createsTask() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"title\": \"CI-Pipeline bauen\", \"done\": false}")
        .when()
            .post("/api/tasks")
        .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("title", equalTo("CI-Pipeline bauen"));

        given().when().get("/api/tasks")
            .then().statusCode(200).body("$", hasSize(1));
    }

    @Test
    void rejectsEmptyTitle() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"title\": \"\", \"done\": false}")
        .when()
            .post("/api/tasks")
        .then()
            .statusCode(400);
    }

    @Test
    void countsOpenTasks() {
        service.create(new Task(null, "offen", false));
        service.create(new Task(null, "erledigt", true));

        given().when().get("/api/tasks/stats")
            .then().statusCode(200).body("open", equalTo(1));
    }
}
