await blocks further execution until resolve, unless encapsulated in async function
.then is non blocking, file execution wont wait for completion, doesnt need async

useEffect
triggers on external effects, like fetching, listen, subscribe, 
DOM manipulations and user behaviour

useEffect(()=>{function}) runs every render
useEffect(()=>{function}, []) run only initial render
useEffect(()=>{function}, [dep]) run when dep value changes

useState
is used to interact with React's 'reactive rendering model'
to correctly trigger on changes in 'state'. for example
var might be null until after fetch() completes. the
page can start without breaking, then complete the page dynamically

const [cards, fillCard] = useState<cardType[] | null>(null);

useEffect(()=>
{
  fetch(url).then((data)=>data.json().then((data)=>fillCard(data)));
}, [url])