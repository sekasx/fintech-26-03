package dev.ctrlspace.fintech2506.fintechbe;

import dev.ctrlspace.fintech2506.fintechbe.controllers.UserController;
import dev.ctrlspace.fintech2506.fintechbe.models.entities.User;
import dev.ctrlspace.fintech2506.fintechbe.repositories.UserRepository;
import dev.ctrlspace.fintech2506.fintechbe.services.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackageClasses = {
        UserController.class,
        FintechBeApplication.class,
        UserService.class,
        UserRepository.class,
})
@EnableJpaRepositories(basePackageClasses = {UserRepository.class})
@EntityScan(basePackageClasses = {
        User.class
})
public class FintechBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(FintechBeApplication.class, args);
    }

}
