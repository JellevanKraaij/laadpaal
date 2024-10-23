// import { Card, CardContent } from "@mui/material";
import Link from "next/link";
import makeCardHtml from "./UImodules/datacard";

type cardType =
{
  "id": string,
  "cardHash": string,
  "name": string,
  "isValid": boolean,
  "totalWh": number,
  "lastUsed": string
};

export default async function Home() {
  const API_URL = "https://laadpaal.jellevankraaij.nl/api/cards";
  const cards: cardType[] = await (await fetch(API_URL, {cache:'no-store'})).json();
  // console.log('logging cards =', cards);
  // console.log('number of cards=', cards.length);
  
  const someArray = [];
  cards.forEach( (card: cardType) =>
  {
    // console.log('forEaachloop=', card);
    // console.log('datacardhtml=', makeCardHtml(card));
    someArray.push(makeCardHtml(card));
  })

  // someArray.forEach((card) =>
  // {
  //   console.log('html Object array=', card);
  // })
  
  return (
      <div>
      {someArray}
      </div>
    );
}


//     "id": "eDso9hf5om8IEt0xiYg7m",
//     "cardHash": "$2a$12$emxXYnGgCCkzEh4f2PcbmON0FT2KD7fnxLXAkh1QQdQp1b6R5t65q",
//     "name": "Blauwe druppel",
//     "isValid": true,
//     "totalWh": 4014,
//     "lastUsed": "2024-10-23T09:42:16.246Z"
//   }
// ]

// model ChargeSessions {
//   id         String    @id @unique @default(nanoid())
//   card       Cards     @relation(fields: [cardId], references: [id])
//   cardId     String
//   createTime DateTime  @default(now())
//   startTime  DateTime?
//   startWh    Int?
//   endTime    DateTime?
//   endWh      Int?
//   totalWh    Int?
//   logs       Logs[]
// }