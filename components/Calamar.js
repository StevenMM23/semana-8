import axios from "axios";
import React, { useEffect, useState } from "react";
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";

const Calamar = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [motivo, setMotivo] = useState("");
  const [allDelincuentes, setAllDelincuentes] = useState([]);
  const [selectedDelincuente, setSelectedDelincuente] = useState(null);

  const handlerOnSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`/api/set_Detenidos`, {
        delincuentes: { nombre, apellido, motivo },
      })
      .then((res) => {
        console.log(res);
        setNombre("");
        setApellido("");
        setMotivo("");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(`/api/get_Detenidos`)
      .then((res) => {
        console.log(res);
        setAllDelincuentes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelincuenteClick = (delincuente) => {
    setSelectedDelincuente(delincuente);
  };

  const generatePDF = () => {
    const MyDocument = () => (
      <Document>
        <Page>
          {allDelincuentes.map((delincuente) => (
            <Text key={delincuente._id}>
              {delincuente.nombre} {delincuente.apellido} - {delincuente.motivo}
            </Text>
          ))}
        </Page>
      </Document>
    );

    // el nombre del archivo PDF que se descargará
    const fileName = "detenidos.pdf";

    return (
      <div>
        <PDFDownloadLink document={<MyDocument />} fileName={fileName}>
          {({ blob, url, loading, error }) =>
            loading ? (
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  fontWeight: "bold",
                  padding: "10px",
                }}
              >
                Generando PDF...
              </button>
            ) : (
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  fontWeight: "bold",
                  padding: "10px",
                }}
              >
                Descargar PDF
              </button>
            )
          }
        </PDFDownloadLink>
      </div>
    );
  };

  return (
    <div>
      <main style={{
        border: "2px solid black",
        borderRadius: "10px",
        padding: "20px"
      }}>
        <h2>Formulario</h2>
        <form>
          <div style={{ marginBottom: "10px" }}>
            <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{
              width: "100%",
              padding: "10px",
              border: "1px solid black",
              borderRadius: "5px"
            }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} style={{
              width: "100%",
              padding: "10px",
              border: "1px solid black",
              borderRadius: "5px"
            }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input type="text" placeholder="Motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} style={{
              width: "100%",
              padding: "10px",
              border: "1px solid black",
              borderRadius: "5px"
            }} />
          </div>
          <button type="submit" onClick={handlerOnSubmit} style={{
            backgroundColor: "red",
            color: "white",
            fontWeight: "bold",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}>Enviar</button>
          <button type="submit" onClick={getData} style={{
            backgroundColor: "red",
            color: "white",
            fontWeight: "bold",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: '2rem' 
          }}>Obtener Datos</button>
        </form>
      </main>
      <section style={{
        border: "2px solid black",
        borderRadius: "10px",
        padding: "20px",
        marginTop: "20px"
      }}>
        <h2>Listado de detenidos</h2>
        {allDelincuentes.length === 0 ? (
          <p>No hay detenidos</p>
        ) : (
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {allDelincuentes.map((delincuente) => (
              <li key={delincuente._id} onClick={() => handleDelincuenteClick(delincuente)} style={{
                border: "1px solid black",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer"
              }}>
                {delincuente.nombre} {delincuente.apellido} - {delincuente.motivo}
              </li>
            ))}
          </ul>
        )}
  
        {selectedDelincuente && (
          <div style={{ marginTop: "20px" }}>
            <h3>Detalles del delincuente seleccionado</h3>
            <p>
              Nombre: {selectedDelincuente.nombre} {selectedDelincuente.apellido}
              <br />
              Motivo: {selectedDelincuente.motivo}
            </p>
          </div>
        )}
  
        {allDelincuentes.length > 0 && (
          <div style={{ marginTop: "20px" }}>{generatePDF()}</div>
        )}
      </section>
    </div>
  );
};

export default Calamar;
