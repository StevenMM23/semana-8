
import Calamar from "@/components/Calamar";
import InscripcionPage from "@/components/INTECForm";



export default function Home() {
  return (
    <div style={{textAlign: 'center'}}>
    <h1>Lista de Delincuentes</h1>
      <Calamar />
      <InscripcionPage/>
    </div>
  );
}
