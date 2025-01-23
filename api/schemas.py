from pydantic import BaseModel
from typing import Optional, List
from datetime import time, date

# Esquema de Estudiante #

class EstudianteBase(BaseModel):
    nombre: str 
    apellido: str 
    email: str 
    # permite que los modelos de Pydantic acepten objetos ORM como entrada y 
    # los conviertan en modelos de Pydantic.
    class Config: 
        from_attributes = True

class EstudianteCreate(EstudianteBase):
    pass # Hereda todos los atributos de EstudianteBase 

class EstudianteResponse(EstudianteBase):
    id_estudiante: int 

    class Config:
        from_attributes = True 


# Esquema para las solicitudes #

class SolicitudBase(BaseModel):
    id_estado: int
    hora_inicio: time
    hora_fin: time
    fecha: date
    id_estudiante: int

class SolicitudCreate(SolicitudBase):
    pass

class SolicitudUpdate(SolicitudBase):
    id_estado: int # Ya que solo cambiaran de estado

class SolicitudResponse(SolicitudBase):
    id_solicitud: int

    class Config:
        from_attributes = True


# Esquema justificaciones (al denegar una solicitud) #

class JustificacionBase(BaseModel):
    id_solicitud: int
    contenido: str 

class JustificacionCreate(JustificacionBase):
    pass

class JustificacionResponse(JustificacionBase):
    id_justificacion: int
    contenido: str

    class Config:
        from_attributes = True


# Esquema estado #

class EtapaBase(BaseModel):
    estado: str 

class EtapaCreate(EtapaBase):
    pass

class EtapaResponse(EtapaBase):
    id_estado: int

    class Config:
        from_attributes = True