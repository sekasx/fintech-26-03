package dev.ctrlspace.fintech2506.fintechbe.services;

import dev.ctrlspace.fintech2506.fintechbe.models.dtos.completions.EmbeddingResponseDTO;
import dev.ctrlspace.fintech2506.fintechbe.models.entities.Account;
import dev.ctrlspace.fintech2506.fintechbe.models.entities.Document;
import dev.ctrlspace.fintech2506.fintechbe.models.entities.DocumentSection;
import dev.ctrlspace.fintech2506.fintechbe.repositories.DocumentRepository;
import dev.ctrlspace.fintech2506.fintechbe.repositories.DocumentSectionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentSectionRepository documentSectionRepository;

    @Autowired
    private CompletionsApiService completionsApiService;

    private String OPENAI_EMBEDDING_URL = "https://api.openai.com/v1/embeddings";
    private String EMBEDDING_MODEL = "text-embedding-3-small";
    @Autowired
    private DocumentRepository documentRepository;

    private ObjectMapper objectMapper = new ObjectMapper();

    public DocumentSection getEmbeddingsForSection(UUID sectionId) {
        DocumentSection section = documentSectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Document section not found"));

        EmbeddingResponseDTO embedding = completionsApiService.getEmbedding(OPENAI_EMBEDDING_URL, section.getContent(), EMBEDDING_MODEL);

        section.setEmbedding(embedding.getData().get(0).getEmbedding());
        return documentSectionRepository.save(section);
    }

    @Transactional
    public DocumentSection getEmbeddingsForText(String text) {

        EmbeddingResponseDTO embedding = completionsApiService.getEmbedding(OPENAI_EMBEDDING_URL, text, EMBEDDING_MODEL);

        Account account = new Account();

        account.setId(UUID.fromString("d34598f9-cb09-404e-a9da-8fe8992800c4"));
        Document doc = new Document();
        doc.setTitle("-");
        doc.setBody(text);
        doc.setStatus("active");
        doc.setAccount(account);

        doc = documentRepository.save(doc);


        DocumentSection section = new DocumentSection();
        section.setDocument(doc);
        section.setContent(text);
        section.setSectionIndex(1);
        section.setEmbedding(embedding.getData().get(0).getEmbedding());
        return documentSectionRepository.save(section);
    }



    public List<DocumentSection> searchDocuments(String question) {
        EmbeddingResponseDTO questionEmbedding = completionsApiService.getEmbedding(OPENAI_EMBEDDING_URL, question, EMBEDDING_MODEL);
        String result = objectMapper.writeValueAsString(questionEmbedding.getData().get(0).getEmbedding());


        // search in the DB for similar embeddings
        List<DocumentSection> sections = documentSectionRepository.vectorSearch( result, UUID.fromString("d34598f9-cb09-404e-a9da-8fe8992800c4"), 5);

        return sections;
    }






}
