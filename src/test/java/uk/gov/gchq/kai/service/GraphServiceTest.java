package uk.gov.gchq.kai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.Test;
import software.amazon.awscdk.core.ConstructNode;
import software.amazon.awscdk.core.IConstruct;
import software.amazon.awscdk.core.Stack;
import software.amazon.awscdk.cxapi.CloudFormationStackArtifact;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;


public class GraphServiceTest {

    private final static ObjectMapper JSON = new ObjectMapper().configure(SerializationFeature.INDENT_OUTPUT, true);

    @Test
    public void shouldBeAnApiGateway() {
        HashMap<String, Object> expectedProperties = new HashMap<>();
        expectedProperties.put("Name", "Graph Service");
        expectedProperties.put("Description", "This service lets you interact with graphs");

        testResourceExists("GraphsKaiAPI3D1ECBF8", "AWS::ApiGateway::RestApi", expectedProperties);
    }

    @Test
    public void shouldHaveAGraphResource() throws JsonProcessingException {
        HashMap<String, Object> expectedProperties = new HashMap<>();
        expectedProperties.put("PathPart", "graphs");
        expectedProperties.put("RestApiId", JSON.readTree("{\"Ref\": \"GraphsKaiAPI3D1ECBF8\"}"));

        testResourceExists("GraphsKaiAPIgraphsDDD68421", "AWS::ApiGateway::Resource", expectedProperties);

    }

    @Test
    public void shouldHaveAGetGraphsEndpoint() throws JsonProcessingException {
        HashMap<String, Object> expectedProperties = new HashMap<>();
        expectedProperties.put("HttpMethod", "GET");
        expectedProperties.put("ResourceId", JSON.readTree("{\"Ref\": \"GraphsKaiAPIgraphsDDD68421\"}"));
        expectedProperties.put("RestApiId", JSON.readTree("{\"Ref\": \"GraphsKaiAPI3D1ECBF8\"}"));

        testResourceExists("GraphsKaiAPIgraphsGET843E0FF4", "AWS::ApiGateway::Method", expectedProperties);
    }

    @Test
    public void shouldCallGetAllLambdaFunctionFromGetGraphs() {
        HashMap<String, Object> expectedProperties = new HashMap<>();
        expectedProperties.put("Handler", "graphs.getAll");

        testResourceExists("GraphsgetAllHandlerE55CFBE2", "AWS::Lambda::Function", expectedProperties);
    }

    @Test
    public void shouldHaveAnAddGraphEndpoint() throws JsonProcessingException {
        HashMap<String, Object> expectedProperties = new HashMap<>();
        expectedProperties.put("HttpMethod", "POST");
        expectedProperties.put("ResourceId", JSON.readTree("{\"Ref\": \"GraphsKaiAPIgraphsDDD68421\"}"));
        expectedProperties.put("RestApiId", JSON.readTree("{\"Ref\": \"GraphsKaiAPI3D1ECBF8\"}"));

        testResourceExists("GraphsKaiAPIgraphsPOSTB2C5BD9E", "AWS::ApiGateway::Method", expectedProperties);
    }

    @Test
    public void shouldCallAddLambdaFunctionFromAddGraph() {
        HashMap<String, Object> expectedProperties = new HashMap<>();
        expectedProperties.put("Handler", "graphs.add");

        testResourceExists("GraphsaddHandlerABFFFB9C", "AWS::Lambda::Function", expectedProperties);
    }

    @Test
    public void shouldHaveADeleteGraphEndpoint() throws JsonProcessingException {
        HashMap<String, Object> expectedProperties = new HashMap<>();
        expectedProperties.put("HttpMethod", "DELETE");
        expectedProperties.put("ResourceId", JSON.readTree("{\"Ref\": \"GraphsKaiAPIgraphsDDD68421\"}"));
        expectedProperties.put("RestApiId", JSON.readTree("{\"Ref\": \"GraphsKaiAPI3D1ECBF8\"}"));

        testResourceExists("GraphsKaiAPIgraphsgraphIdDELETE0D44DD26", "AWS::ApiGateway::Method", expectedProperties);
    }

    @Test
    public void shouldCallDeleteLambdaFunctionFromAddGraph() {
        HashMap<String, Object> expectedProperties = new HashMap<>();
        expectedProperties.put("Handler", "graphs.delete");

        testResourceExists("GraphsdeleteHandlerF55FD6A9", "AWS::Lambda::Function", expectedProperties);
    }

    private void testResourceExists(final String name, final String type, final Map<String, Object> properties) {
        JsonNode node = createStackNode().get("Resources").get(name);
        assertNotNull("Resource formally known as " + name + " has been renamed or has been removed", node);

        assertEquals(type, node.get("Type").asText());

        properties.forEach((k, v) ->
                assertEquals(v,
                        v.getClass() == String.class ?
                                node.get("Properties").get(k).asText() : // Removes quotes
                                node.get("Properties").get(k)));

    }

    private JsonNode createStackNode() {
        Stack stack = new Stack(null, "test");
        GraphService service = new GraphService(stack, "Graphs");

        return JSON.valueToTree(getTemplate(stack));
    }

    private Object getTemplate(final Stack stack) {
        IConstruct root = stack.getNode().getRoot();
        CloudFormationStackArtifact stackArtifact =
                ConstructNode.synth(root.getNode()).getStackArtifact(stack.getArtifactId());
        return stackArtifact.getTemplate();
    }
}
