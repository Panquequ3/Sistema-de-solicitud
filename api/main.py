from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel # Para la validación de datos, conversión de tipos, etc.
from typing import List, Annotated
import models # Donde están las tablas de la base de datos
from database import engine, SessionLocal
from sqlalchemy.orm import Session, joinedload
from schemas import ( EstudianteBase, EstudianteCreate, EstudianteResponse,
    SolicitudBase, SolicitudCreate, SolicitudUpdate, SolicitudResponse, SolicitudEstudianteResponse,
    JustificacionBase, JustificacionCreate, JustificacionResponse,
    EtapaBase, EtapaCreate, EtapaResponse )
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
def muestra_solicitud(solicitud_id: int, db: Session = Depends(get_db)):
    db_solicitud = db.query(models.Solicitud).filter(models.Solicitud.id_solicitud == solicitud_id).first()
    if db_solicitud is None:
        raise HTTPException(status_code=404, detail="No se encontraron solicitudes")
    return db_solicitud

# Ruta GET para obtener todas las solicitudes
@app.get("/solicitudes/", response_model=List[SolicitudResponse])
def obtener_solicitudes(db: Session = Depends(get_db)):
    return db.query(models.Solicitud).all()

# Ruta GET para obtener todas las solicitudes con información del estudiante
@app.get("/solicitudesEstudiantes/", response_model=List[SolicitudEstudianteResponse])
def obtener_solicitudes_con_estudiantes(db: Session = Depends(get_db)):
    solicitudes = db.query(models.Solicitud).all()
    solicitudes_con_estudiantes = []
    for solicitud in solicitudes:
        estudiante = db.query(models.Estudiante).filter(models.Estudiante.id_estudiante == solicitud.id_estudiante).first()
        if estudiante:
            solicitud_data = {
                "id_solicitud": solicitud.id_solicitud,
                "fecha": solicitud.fecha,
                "hora_inicio": solicitud.hora_inicio,
                "hora_fin": solicitud.hora_fin,
                "id_estado": solicitud.id_estado,
                "id_estudiante": solicitud.id_estudiante,
                "nombre_estudiante": f"{estudiante.nombre} {estudiante.apellido}",
                "email": estudiante.email
            }
            solicitudes_con_estudiantes.append(solicitud_data)
    return solicitudes_con_estudiantes

# Ruta PUT para actualizar una solicitud existente
@app.put("/solicitudes/{solicitud_id}", response_model=SolicitudResponse)
def update_solicitud(solicitud_id: int, solicitud: SolicitudUpdate, db: Session = Depends(get_db)):
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

@app.get("/estudiante/{estudiante_id}", response_model=EstudianteResponse)
def obtener_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    db_estudiante = db.query(models.Estudiante).filter(models.Estudiante.id_estudiante == estudiante_id).first()
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


