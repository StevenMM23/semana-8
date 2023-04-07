import { useState } from "react";
import { useRouter } from "next/router";
import {
  PDFDocument,
  Page,
  Text,
  View,
  Image,
  Font,
} from "@react-pdf/renderer";
import {
  AmazonRekognitionClient,
  DetectLabelsCommand,
} from "@aws-sdk/client-rekognition";

// Para utilizar fuentes personalizadas en el PDF
Font.register({
  family: "Montserrat",
  src: "https://fonts.gstatic.com/s/montserrat/v22/JTURjIg1_i6t8kCHKm45_dJE3gfD-w.ttf",
});

// Estilos para el PDF
const styles = {
  page: {
    fontFamily: "Montserrat",
    backgroundColor: "#ffffff",
    padding: "2cm",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  image: {
    width: "50%",
    height: "auto",
    marginBottom: 10,
  },
  discount: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#ff0000",
  },
};

export default function InscripcionPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [foto, setFoto] = useState(null);
  const [isCelebrity, setIsCelebrity] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("cedula", cedula);
    formData.append("foto", foto);

    // Detectar si la foto es de una celebridad utilizando Amazon Rekognition
    const client = new AmazonRekognitionClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: "TU_ACCESS_KEY_ID",
        secretAccessKey: "TU_SECRET_ACCESS_KEY",
      },
    });
    const params = {
      Image: {
        Bytes: foto,
      },
    };
    const command = new DetectLabelsCommand(params);
    client
      .send(command)
      .then((response) => {
        const celebrities = response.Labels.filter(
          (label) => label.Name === "Celebrity"
        );
        if (celebrities.length > 0) {
          setIsCelebrity(true);
        }
        const pdfBlob = generatePDF(formData, isCelebrity);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      setFoto(e.target.result);
    };
  };

  const generatePDF = (formData, isCelebrity) => {
    // Crear un nuevo documento PDF
    const pdfDoc = (
      <PDFDocument>
        <Page style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Formulario de inscripción</Text>
            <Text style={styles.subtitle}>Nombre completo:</Text>
            <Text style={styles.text}>
              {formData.get("nombre")} {formData.get("apellido")}
            </Text>
            <Text style={styles.subtitle}>Cédula:</Text>
            <Text style={styles.text}>{formData.get("cedula")}</Text>
            <Text style={styles.subtitle}>Foto:</Text>
            {foto && <Image style={styles.image} src={foto} />}
            {isCelebrity && (
              <Text style={styles.discount}>
                Obtén un 10% de descuento por ser una celebridad
              </Text>
            )}
          </View>
        </Page>
      </PDFDocument>
    ); // Cierre del PDFDocument
    // Renderizar el documento PDF
    return PDFDocument.create().updateContainer(pdfDoc).toBlob();
  };

  return (
    <div>
      <h1>Inscripción</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <br />
        <label>
          Apellido:
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </label>
        <br />
        <label>
          Cédula:
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
        </label>
        <br />
        <label>
          Foto:
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
          />
        </label>
        <br />
        <button type="submit">Inscribirse</button>
      </form>
    </div>
  );
}
