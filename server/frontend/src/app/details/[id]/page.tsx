'use client'
import { usePathname } from 'next/navigation'

type Charge =
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

type cardType =
{
  "id": string,
  "cardHash": string,
  "name": string,
  "isValid": boolean,
  "totalWh": number,
  "lastUsed": string
};

export default async function cardpage() {

    // const cardID = useParams();
    const pathname = usePathname();
    const urlPart = pathname.split('/')[2];

    console.log(urlPart);

    // const cards: cardType[] = await (await fetch("https://laadpaal.jellevankraaij.nl/api/cards")).json();
    const charge: Charge = await (await fetch(`https://laadpaal.jellevankraaij.nl/api/cards/${urlPart}`)).json();
    return (
    <>
        <p>
        card: {charge.card}
        </p>
        <p>
        start time: {charge.startTime}
        </p>
        <p>
        end time: {charge.endTime}
        </p>
        <p>
        startWh: {charge.startWh}
        </p>
        <p>
        endWh: {charge.endWh}
        </p>
        <p>
        totalWh: {charge.totalWh}
        </p>
    </>
   
    );
  }