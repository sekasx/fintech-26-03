package dev.ctrlspace.fintech2506.fintechbe.models.dtos.completions;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDTO {

    private String role;
    private String content;
    @JsonProperty("tool_call_id")
    private String toolCallId;
    @JsonProperty("name")
    private String name;
    @JsonProperty("tool_calls")
    private List<ToolCall> toolCalls;


    public static class ToolCall {
        private String id;
        private String type;
        private FunctionCall function;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public FunctionCall getFunction() {
            return function;
        }

        public void setFunction(FunctionCall function) {
            this.function = function;
        }
    }

    public static class FunctionCall {
        private String arguments;
        private String name;

        public String getArguments() {
            return arguments;
        }

        public void setArguments(String arguments) {
            this.arguments = arguments;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }


}
