import axios from "axios";
import React, { useEffect, useState } from "react";


const Calamar = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [motivo, setMotivo] = useState("");
    const [allDelincuentes, setAllDelincuentes] = useState([]);
  
    const handlerOnSubmit = (e) => {
      e.preventDefault();
    };
  
    const sendData = () => {
      axios
        .post(`/api/set_Detenidos`, {
          delincuentes: {
            nombre,
            apellido,
            motivo,
          },
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
    }, [nombre, apellido, motivo]); // Agregamos dependencias a este efecto
  
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
  
    return (
      <div>
        <main>
          <form onSubmit={handlerOnSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => {
                setApellido(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Motivo"
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
              }}
            />
  
            <button onClick={sendData} type="submit">
              Send LADRONAZO
            </button>
  
            <button onClick={getData} type="submit">
              Get All Delincuentes
            </button>
          </form>
          {allDelincuentes.map(
            (data) => (
              <div key={data._id}>
                <h2>
                  {data.delincuentes.nombre} {data.delincuentes.apellido}
                </h2>
                <p>Motivo: {data.delincuentes.motivo}</p>
              </div>
            )
          )}
        </main>
      </div>
    );
  };
  
  export default Calamar;
  