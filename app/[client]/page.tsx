// main greeting card form component
import GreetingCardForm from "../../components/GreetingCardForm";

// dynamic client page that displays personalized greeting card creator
export default async function ClientPage({ params }: any) {
  // extract client name from url parameters (next.js 15 requires await)
  const { client } = await params as { client: string };
  // format client name for display (capitalize first letter)
  const clientDisplayName = client.charAt(0).toUpperCase() + client.slice(1);
  
  return (
    <main>
      <h1>Holiday Greeting Card Generator</h1>
      <GreetingCardForm client={clientDisplayName} />
    </main>
  );
}
