export type cardType =
{
  "id": string,
  "cardHash": string,
  "name": string,
  "isValid": boolean,
  "totalWh": number,
  "lastUsed": string,
  "imageUrl": string
};

export type cardDetailsType =
{
    "id":   string,
    "card": string,
    "cardId":     string,
    "createTime": string,
    "startTime":  string,
    "startWh":   number
    "endTime":    string,
    "endWh":      number
    "totalWh":    number
}