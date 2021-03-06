import os
import boto3
import json

graph_table_name = os.getenv("graph_table_name")

class NotFoundException(Exception):
    pass


# Dynamodb table
dynamo = boto3.resource("dynamodb")
table = dynamo.Table(graph_table_name)

def get_all_graphs():
    """
    Gets all graphs from Dynamodb table
    """
    return table.scan()["Items"]


def get_graph(graph_id):
    """
    Gets a specific graph from Dynamodb table
    """
    response = table.get_item(
        Key={
            "graphId": graph_id
        }
    )
    if "Item" in response:
        return response["Item"]
    raise NotFoundException


def handler(event, context):
    """
    Main entrypoint for the HTTP GET lambda functions. This function
    serves both GET handlers so returns all graphs if no graphId
    is specified in the path parameters
    """

    path_params = event["pathParameters"]
    return_all = False
    graph_id = None
    if path_params is None or path_params["graphId"] is None:
        return_all = True
    else:
        graph_id = path_params["graphId"]

    if return_all:
        return {
            "statusCode": 200,
            "body": json.dumps(get_all_graphs())
        }
    else:
        try:
            return {
                "statusCode": 200,
                "body": json.dumps(get_graph(graph_id))
            }
        except NotFoundException as e:
            return {
                "statusCode": 404,
                "body": graph_id + " was not found"
            }

