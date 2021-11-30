// migrate jms message "{\"ErrorMessage\": \"404\",\"User\":\"${user}\"}" to kafka
export interface FailureMessage {
  id: string,
  title: string,
  status: string,
  type: string,
  user_id : string
}
