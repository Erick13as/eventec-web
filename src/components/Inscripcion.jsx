import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onSnapshot, collection, query, getDocs, where, updateDoc, deleteDoc, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

function Inscripcion() {
    const navigate = useNavigate();
    const location = useLocation();
    const evento = location.state && location.state.evento;
    const correo = location.state && location.state.correo;
    const [eventoData, setEventoData] = useState(null);

    useEffect(() => {
        // Realizar la consulta a la colección "evento" en Firebase Firestore
        const eventosRef = collection(db, 'evento');
        const q = query(eventosRef, where('nombre', '==', evento));

        getDocs(q)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const eventoDoc = querySnapshot.docs[0];
                    const eventData = eventoDoc.data();
                    setEventoData(eventData);
                } else {
                    console.log('No se encontró el evento en la base de datos.');
                }
            })
            .catch((error) => {
                console.error('Error al obtener los datos del evento:', error);
            });
    }, [evento]);

    const inscribirse = async () => {
        // Realizar la consulta a la colección "inscripcion" en Firebase Firestore
        const inscripcionesRef = collection(db, 'inscripcion');
        const q = query(inscripcionesRef, where('correo', '==', correo), where('idEstado', '==', 'interes'));
        const eventosRef = collection(db, 'evento');
        const q2 = query(eventosRef, where('nombre', '==', evento));

        const querySnapshot = await getDocs(q);
        const querySnapshot2 = await getDocs(q2);

        if (!querySnapshot.empty && !querySnapshot2.empty) {
            const inscripcionDoc = querySnapshot.docs[0];
            const eventosDoc = querySnapshot2.docs[0];
            // Obtener el ID del documento de inscripción
            const inscripcionId = inscripcionDoc.id;
            const eventosId = eventosDoc.id;

            // Crear una referencia al documento de inscripción
            const inscripcionDocRef = doc(db, 'inscripcion', inscripcionId);
            const eventosDocRef = doc(db, 'evento', eventosId);

            // Actualizar el valor de idEstado a "inscrito"
            await updateDoc(inscripcionDocRef, {
                idEstado: 'inscrito',
                capacidad: eventoData.capacidad - 1
            });
            await updateDoc(eventosDocRef, {
                capacidad: eventoData.capacidad - 1
            });

            console.log('Inscripción exitosa');
            navigate('/confirmarInscrip', { state: { evento: evento, correo: correo, fecha: eventoData.fechaInicio, hora: eventoData.horaInicio } })
        } else {
            console.log('No se encontró una inscripción que cumpla con los criterios.');
        }
    };

    return (
        <div className="galeria-container">
            <form className="formBarra">
                <button onClick={() => navigate('/lobbyEstudiante', { state: { correo: correo } })} className='botonOA'>Volver al inicio</button>
                <div className="botonBarra-container">
                    <button onClick={() => navigate('/eventec-web')} className='botonOA2'>Cerrar Sesión</button>
                </div>
            </form>
            <p></p>
            <p></p>
            <div className="form-inscripcion">
                <h1>{evento}</h1>
                {eventoData && (
                    <div>
                        <p>Capacidad: {eventoData.capacidad}</p>
                        <p>Fecha de Inicio: {eventoData.fechaInicio}</p>
                        <p>Hora de Inicio: {eventoData.horaInicio}</p>
                    </div>
                )}
                <p></p>
                <button onClick={inscribirse} className='botonOA2'>Inscribirse</button>
            </div>
        </div>
    );
}

export default Inscripcion;
