package dev.ctrlspace.fintech2506.fintechbe.tools;

import dev.ctrlspace.fintech2506.fintechbe.models.dtos.completions.MessageDTO;

public interface Tool {

    String getName();
    MessageDTO execute(MessageDTO.ToolCall toolCall);
}
