from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel # Para la validación de datos, conversión de tipos, etc.
from typing import List, Annotated
import models # Donde están las tablas de la base de datos
from database import engine, SessionLocal
from sqlalchemy.orm import Session, joinedload
from schemas import ( EstudianteBase, EstudianteCreate, EstudianteResponse,
    SolicitudBase, SolicitudCreate, SolicitudUpdate, SolicitudResponse, SolicitudCompletaResponse,
    JustificacionBase, JustificacionCreate, JustificacionResponse,
    EtapaBase, EtapaCreate, EtapaResponse, LoginRequest, EmailSchema )
from sqlalchemy import between, or_, func
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType 
from starlette.responses import JSONResponse
from datetime import datetime
from dotenv import load_dotenv
import os

# Cargar variables de entorno desde el archivo .env
load_dotenv()

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

# rutas #

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



def construir_solicitud_data(solicitud, estudiante, etapa):
    return {
        "id_solicitud": solicitud.id_solicitud,
        "fecha": solicitud.fecha,
        "hora_inicio": solicitud.hora_inicio,
        "hora_fin": solicitud.hora_fin,
        "estado": etapa.estado,
        "id_estudiante": solicitud.id_estudiante,
        "descripcion": solicitud.descripcion,
        "nombre_estudiante": f"{estudiante.nombre} {estudiante.apellido}",
        "email": estudiante.email,
        "sala": solicitud.sala 
    }

# Ruta GET para obtener todas las solicitudes con información del estudiante
@app.get("/solicitudesInfo/", response_model=List[SolicitudCompletaResponse])
def obtener_solicitudes_con_estudiantes(db: Session = Depends(get_db)):
    solicitudes = db.query(models.Solicitud).all() # Obtiene todas las solicitudes mediante una consulta para la tabla solicitud
    solicitudes_con_estudiante = []
    for solicitud in solicitudes: # Recorremos todas las solicitudes
        estudiante = db.query(models.Estudiante).filter(models.Estudiante.id_estudiante == solicitud.id_estudiante).first()
        etapa = db.query(models.Etapa).filter(models.Etapa.id_estado == solicitud.id_estado).first()
        if estudiante:
            solicitud_data = construir_solicitud_data(solicitud, estudiante, etapa)
            solicitudes_con_estudiante.append(solicitud_data)
    return solicitudes_con_estudiante

@app.get("/solicitudesPorNombre/{nombre}", response_model=List[SolicitudCompletaResponse])
def obtener_solicitudes_por_nombre(nombre: str, db: Session = Depends(get_db)):
    solicitudes = db.query(models.Solicitud).join(models.Estudiante).filter(
        or_(
            func.lower(models.Estudiante.nombre).like(f"%{nombre}%"),
            func.lower(models.Estudiante.apellido).like(f"%{nombre}%")
        )
    ).all()
    solicitudes_por_nombre = []
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
                "email": estudiante.email,
                "sala": solicitud.sala 
            }
            solicitudes_por_nombre.append(solicitud_data)
    return solicitudes_por_nombre

@app.get("/solicitudesPorEmail/{email}", response_model=List[SolicitudCompletaResponse])
def obtener_solicitudes_por_email(email: str, db: Session = Depends(get_db)):
    solicitudes = db.query(models.Solicitud).join(models.Estudiante).filter(
        or_((models.Estudiante.email).like(f"%{email}%"))
    ).all()
    solicitudes_por_email = []
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
                "email": estudiante.email,
                "sala": solicitud.sala 
            }
            solicitudes_por_email.append(solicitud_data)
    return solicitudes_por_email

@app.get("/solicitudesPorFecha/{fechaIni}/{fechaFin}", response_model=List[SolicitudCompletaResponse])
def obtener_solicitudes_por_fecha(fechaIni: str, fechaFin: str, db: Session = Depends(get_db)):
    fecha_ini = datetime.strptime(fechaIni, "%Y-%m-%d")
    fecha_fin = datetime.strptime(fechaFin, "%Y-%m-%d")

    solicitudes = db.query(models.Solicitud).filter( models.Solicitud.fecha.between(fecha_ini, fecha_fin)).all()

    solicitudes_por_fecha = []
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
                "email": estudiante.email,
                "sala": solicitud.sala 
            }
            solicitudes_por_fecha.append(solicitud_data)
    return solicitudes_por_fecha



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

""" AUTENTICACION """

# Configuración de PassLib para el hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Función para verificar la contraseña
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Ruta de autenticacion
@app.post("/login/")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    db_admin = db.query(models.Administrador).filter(models.Administrador.email == request.email).first()
    if db_admin is None or not verify_password(request.contrasena, db_admin.contrasena):
        raise HTTPException(status_code=401, detail="datos incorrectos")
    return {"message": "Inicio de sesión exitoso"}


conf = ConnectionConfig (
    MAIL_USERNAME = os.getenv("USER"),
    MAIL_PASSWORD = os.getenv("PASSWORD"),
    MAIL_FROM = os.getenv("USER_EMAIL"),
    MAIL_PORT = int(os.getenv("PORT")),
    MAIL_SERVER = os.getenv("SERVER"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME"),
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

@app.post("/email")
async def envia(email: EmailSchema) -> JSONResponse:
    html = f"""<p>{email.cuerpo}</p>"""

    message = MessageSchema(
        subject="Notificación",
        recipients=[email.email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    return JSONResponse(status_code=200, content={"message": "email has been sent"})

