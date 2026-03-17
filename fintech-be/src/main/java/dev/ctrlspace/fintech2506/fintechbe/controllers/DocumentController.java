package dev.ctrlspace.fintech2506.fintechbe.controllers;

import dev.ctrlspace.fintech2506.fintechbe.models.dtos.completions.MessageDTO;
import dev.ctrlspace.fintech2506.fintechbe.models.entities.Document;
import dev.ctrlspace.fintech2506.fintechbe.models.entities.DocumentSection;
import dev.ctrlspace.fintech2506.fintechbe.services.DocumentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/documents")
    public List<Document> getAllDocuments() {
//        return documentService.getAll();
        return null;
    }

    @PostMapping("/documents")
    public DocumentSection createDocument(@RequestBody Document document) {

        return documentService.getEmbeddingsForText(document.getBody());
    }


    @GetMapping("/documents/search")
    public List<DocumentSection> searchDocuments(@RequestParam("text") String text) {
        return documentService.searchDocuments(text);
    }

    @PostMapping("/rag")
    public MessageDTO ragCompletion(@RequestParam("text") String text) {
        return documentService.ragCompletion(text);
    }

}



