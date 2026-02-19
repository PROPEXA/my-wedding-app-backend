/**
 * ResponseServer is an interface that defines the structure of the response received from the server.
 * It includes the following properties:
 * - code: A number representing the status code of the response.
 * - phrase: A string representing a brief description of the response status.
 * - message: A string containing a more detailed message about the response.
 * - content: An any type that can hold any additional data returned by the server.
 */
export interface ResponseServer {
  code: number;
  phrase: string;
  message: string;
  content: any;
}
