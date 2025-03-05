from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Time, Date
from database import Base

# Tabla que almacena la etapa en la que se encuentra una solicitud (aceptado, denegado, pendiente)
class Etapa(Base):
    __tablename__ = "etapa"

    id_estado = Column(Integer, primary_key = True, index = True)
    estado = Column(String)

# Tabla que va almacenando los datos de los estudiantes que hacen una solicitud
class Estudiante(Base):
    __tablename__ = "estudiante"

    id_estudiante = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String, index=True)
    apellido = Column(String, index=True)
    email = Column(String, unique=True, index=True)

# Tabla que contiene las solicitudes que hacen los estudiantes
class Solicitud(Base):
    __tablename__ = "solicitud"

    id_solicitud = Column(Integer, primary_key = True, index = True, autoincrement=True)
    id_estado = Column(Integer, ForeignKey("etapa.id_estado"))
    hora_inicio = Column(Time)
    hora_fin = Column(Time)
    fecha = Column(Date)
    id_estudiante = Column(Integer, ForeignKey("estudiante.id_estudiante") )
    descripcion = Column(String)
    sala = Column(String)

# Tabla que almacena la justificación de por qué fue denegada la solicitud de un estudiante
class Justificacion(Base):
    __tablename__ = "justificacion"

    id_justificacion = Column(Integer, primary_key = True, index = True, autoincrement=True)
    id_solicitud = Column(Integer, ForeignKey("solicitud.id_solicitud"))
    contenido = Column(String)

# Tabla que almacena los datos del administrador (profesor)
class Administrador(Base):
    __tablename__ = "administrador"

    id_admin = Column(Integer, primary_key = True, index = True)    
    nombre = Column(String)
    apellido = Column(String)
    contrasena = Column(String)
    email = Column(String)