
export default async function Page({ params }: {params: {id: string}}) {
	const id = params.id;
  return (
	<div>
	  <h1> {id} </h1>
	</div>
  );
}