package dev.ctrlspace.fintech2506.fintechbe.services;

import dev.ctrlspace.fintech2506.fintechbe.models.dtos.completions.*;
import dev.ctrlspace.fintech2506.fintechbe.models.dtos.completions.ChatCompletionResponse;
import dev.ctrlspace.fintech2506.fintechbe.models.entities.Agent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.List;

@Service
public class CompletionsApiService {

    private String apiKey;


    public CompletionsApiService(@Value("${llms.openai.key}") String apiKey) {
        this.apiKey = apiKey;
    }

    public ChatCompletionResponse getCompletion(Agent agent, List<MessageDTO> messages, List<JsonNode> tools) {
        String url = "https://api.openai.com/v1/chat/completions";
        return getCompletion(url, agent.getLlmModel(), messages, agent.getTemperature(), agent.getMaxTokens(), agent.getBehavior(), tools);
    }

    public ChatCompletionResponse getCompletion(String url, String model, List<MessageDTO> messages, Double temperature, Integer maxTokens, String systemPrompt, List<JsonNode> tools) {
        RestTemplate restTemplate = new RestTemplate();

        // 2. Build headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        RequestDTO requestBody = RequestDTO.builder()
                .model(model)
                .messages(new ArrayList<>())
                .reasoningEffort("minimal")
                .temperature(temperature)
                .maxCompletionTokens(maxTokens)
                .toolChoice("auto")
                .tools(tools)
                .build();
        requestBody.getMessages().add(MessageDTO.builder()
                .role("system")
                .content(systemPrompt)
                .build());

        for (MessageDTO message : messages) {
            requestBody.getMessages().addLast(message);
        }



        HttpEntity request = new HttpEntity<>(requestBody, headers);
        ResponseEntity response = restTemplate.postForEntity(
                url,
                request,
                ChatCompletionResponse.class);

        ChatCompletionResponse responseBody = (ChatCompletionResponse) response.getBody();

        return responseBody;
    }


    public EmbeddingResponseDTO getEmbedding(String url, String input, String model) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        EmbeddingRequestDTO requestBody = EmbeddingRequestDTO.builder()
                .input(input)
                .model(model)
                .build();

        HttpEntity<EmbeddingRequestDTO> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<EmbeddingResponseDTO> response = restTemplate.postForEntity(
                url,
                request,
                EmbeddingResponseDTO.class
        );

        return response.getBody();
    }
}
