from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel # Para la validación de datos, conversión de tipos, etc.
from typing import List, Annotated
import models # Donde están las tablas de la base de datos
from database import engine, SessionLocal
from sqlalchemy.orm import Session, joinedload
from schemas import ( EstudianteBase, EstudianteCreate, EstudianteResponse,
    SolicitudBase, SolicitudCreate, SolicitudUpdate, SolicitudResponse, SolicitudCompletaResponse,
    JustificacionBase, JustificacionCreate, JustificacionResponse,
    EtapaBase, EtapaCreate, EtapaResponse )
from sqlalchemy import and_
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
models.Base.metadata.create_all(bind=engine) # Crear tablas en la base de datos

# Crear una sesión para cada solicitud
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# endpoints o rutas #

@app.get("/") # Esto es una ruta, puede ser .get() .post() .put() .delete()
def index():
    return "hola mundo"



""" SOLICITUDES """

# Ruta POST para crear una nueva solicitud
@app.post("/solicitudes/", response_model=SolicitudResponse)
def crear_solicitud(solicitud: SolicitudCreate, db: Session = Depends(get_db)):
    db_solicitud = models.Solicitud(**solicitud.dict())
    db.add(db_solicitud)
    db.commit()
    db.refresh(db_solicitud)
    return db_solicitud

# Ruta GET para obtener una solicitud por su ID
@app.get("/solicitudes/{solicitud_id}", response_model=SolicitudResponse)
def solicitud_por_id(solicitud_id: int, db: Session = Depends(get_db)):
    db_solicitud = db.query(models.Solicitud).filter(models.Solicitud.id_solicitud == solicitud_id).first()
    if db_solicitud is None:
        raise HTTPException(status_code=404, detail="No se encontraron solicitudes")
    return db_solicitud

# Ruta GET para obtener todas las solicitudes
@app.get("/solicitudes/", response_model=List[SolicitudResponse])
def obtener_solicitudes(db: Session = Depends(get_db)):
    return db.query(models.Solicitud).order_by(models.Solicitud.id_solicitud.desc()).all()

# Ruta GET para obtener todas las solicitudes con información del estudiante
@app.get("/solicitudesInfo/", response_model=List[SolicitudCompletaResponse])
def obtener_solicitudes_con_estudiantes(db: Session = Depends(get_db)):
    solicitudes = db.query(models.Solicitud).all() # Obtiene todas las solicitudes mediante una consulta para la tabla solicitud
    solicitudes_con_estudiantes = []
    for solicitud in solicitudes: # Recorremos todas las solicitudes
        estudiante = db.query(models.Estudiante).filter(models.Estudiante.id_estudiante == solicitud.id_estudiante).first()
        etapa = db.query(models.Etapa).filter(models.Etapa.id_estado == solicitud.id_estado).first()
        if estudiante:
            solicitud_data = {
                "id_solicitud": solicitud.id_solicitud,
                "fecha": solicitud.fecha,
                "hora_inicio": solicitud.hora_inicio,
                "hora_fin": solicitud.hora_fin,
                "estado": etapa.estado,
                "id_estudiante": solicitud.id_estudiante,
                "descripcion": solicitud.descripcion,
                "nombre_estudiante": f"{estudiante.nombre} {estudiante.apellido}",
                "email": estudiante.email
            }
            solicitudes_con_estudiantes.append(solicitud_data)
    return solicitudes_con_estudiantes


# Ruta PUT para actualizar una solicitud existente
@app.put("/solicitudes/{solicitud_id}", response_model=SolicitudResponse)
def estado_solicitud(solicitud_id: int, solicitud: SolicitudUpdate, db: Session = Depends(get_db)):
    db_solicitud = db.query(models.Solicitud).filter(models.Solicitud.id_solicitud == solicitud_id).first()
    if db_solicitud is None:
        raise HTTPException(status_code=404, detail="No se encontraron solicitudes")
    db_solicitud.id_estado = solicitud.id_estado
    db.commit()
    db.refresh(db_solicitud)
    return db_solicitud



""" ESTUDIANTE """
# Rutas para los estudiantes
@app.post("/estudiante/", response_model=EstudianteResponse)
def crear_estudiante(estudiante: EstudianteCreate, db: Session = Depends(get_db)):
    db_estudiante = models.Estudiante(**estudiante.dict())
    db.add(db_estudiante)
    db.commit()
    db.refresh(db_estudiante)
    return db_estudiante

# @app.post("/estudiante/{email}", response_model=EstudianteResponse)
# def obtiene_estudiante(estudiante: EstudianteCreate, email: str, db: Session = Depends(get_db)):
#     # Consulta si el estudiante existe
#     db_estudiante = db.query(models.Estudiante).filter(models.Estudiante.email == email).first() 
#     # Si no existe, entonces lo crea
#     if db_estudiante is None:
#         db_estudiante = models.Estudiante(**estudiante.dict())
#         db.add(db_estudiante)
#         db.commit()
#         db.refresh(db_estudiante)

#     return db_estudiante # Retorna el estudiante

@app.get("/estudiante/{email}", response_model=EstudianteResponse)
def obtener_estudiante(email: str, db: Session = Depends(get_db)):
    db_estudiante = db.query(models.Estudiante).filter(models.Estudiante.email == email).first()
    if db_estudiante is None:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return db_estudiante


""" ESTADO """
# Rutas para la etapa de solicitud

@app.post("/estado/", response_model=EtapaResponse)
def crear_estado(estado: EtapaCreate, db: Session = Depends(get_db)):
    db_estado = models.Etapa(**estado.dict())
    db.add(db_estado)
    db.commit()
    db.refresh(db_estado)
    return db_estado

@app.get("/estado/{estado_id}", response_model=EtapaResponse)
def obtener_estado(estado_id: int, db: Session = Depends(get_db)):
    db_estado= db.query(models.Etapa).filter(models.Etapa.id_estado == estado_id).first()
    if db_estado is None:
        raise HTTPException(status_code=404, detail="Estado no encontrado")
    return db_estado

""" JUSTIFICACION """
# Ruta POST para crear una justificacion
@app.post("/justificacion/", response_model=JustificacionResponse)
def crear_justificacion(justificacion: JustificacionCreate, db: Session = Depends(get_db)):
    # Crear una instancia del modelo Justificacion con los datos recibidos
    db_justificacion = models.Justificacion(**justificacion.dict())

    # Agregar la justificación a la sesión de la base de datos
    db.add(db_justificacion)

    # Confirmar la transacción
    db.commit()

    # Refrescar la instancia para obtener los datos actualizados de la base de datos
    db.refresh(db_justificacion)
    
    return db_justificacion
