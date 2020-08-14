import { Graph } from '../domain/graph';

export class RestClient {

  public static async getAllGraphs(): Promise<Graph[]> {
      const response = await fetch('/graphs');
      const body = await response.json();
  
      if (response.status !== 200) {
        throw Error(body.message) 
      }

      return body.map((jsonObject: any) => {
        return new Graph(jsonObject.graphId, jsonObject.currentState)
      });
  }

  public static async getGraphById(graphId: number): Promise<Graph> {
      const response = await fetch('/graphs/' + graphId);
      const body = await response.json();
  
      if (response.status !== 200) {
        throw Error(body.message) 
      }

      return new Graph(body.graphId, body.currentState);
  }

  public static async deleteGraphById(graphId: number): Promise<void> {
    const response = await fetch('/graphs/' + graphId, {
      method: 'delete',
    });
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message) 
    }
  }
  public static async createNewGraph(newGraph: {}): Promise<any> {
      const response =await fetch('/graphs', {
          method: 'POST',
          body: JSON.stringify(newGraph)

      });
      console.log(response);

      if (response.status !== 201) {
          throw Error("Graph was not created")
      }




  }

}
