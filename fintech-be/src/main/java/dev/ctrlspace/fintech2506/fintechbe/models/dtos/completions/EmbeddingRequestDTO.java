package dev.ctrlspace.fintech2506.fintechbe.models.dtos.completions;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmbeddingRequestDTO {

    private String model;
    private String input;
}
