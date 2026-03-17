package dev.ctrlspace.fintech2506.fintechbe.models.dtos.completions;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddingResponseDTO {

    private String object;
    private List<EmbeddingDataDTO> data;
    private String model;
    private UsageDTO usage;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmbeddingDataDTO {
        private String object;
        private List<Double> embedding;
        private Integer index;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsageDTO {
        @JsonProperty("prompt_tokens")
        private Integer promptTokens;

        @JsonProperty("total_tokens")
        private Integer totalTokens;
    }
}
