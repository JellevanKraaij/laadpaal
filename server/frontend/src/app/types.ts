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

export type chargeSessionType =
{
  "id": string,
  "cardId": string,
  "createTime": string,
  "startTime": string,
  "startWh": number,
  "endTime": string,
  "endWh": number,
  "totalWh": number
}

export type paymentType =
{
  "id": string,
  "cardId": string,
  "createTime": string,
  "whPaid": number,
  "description": string,
}

export type detailsType =
  {
    "id": string,
    "cardHash": string,
    "name": string,
    "isValid": boolean,
    "totalWh": number,
    "lastUsed": string,
    "imageUrl": string,
    "chargeSessions": chargeSessionType[],
    "payments": paymentType[],
    "balance": number
  }