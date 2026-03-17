package dev.ctrlspace.fintech2506.fintechbe.repositories;

import dev.ctrlspace.fintech2506.fintechbe.models.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID> {
}
