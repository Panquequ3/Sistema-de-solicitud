from passlib.context import CryptContext
import re
# Configuración de PassLib para el hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
password_regex = re.compile(r'^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$')

# Función para obtener el hash de la contraseña
def get_password_hash(password):
    return pwd_context.hash(password)

# Funcion para validar que la contraseña cumpla las condiciones
def validate_password(password):
    if password_regex.fullmatch(password):
        return True
    else:
        return False
# Generar el hash de la contraseña
print("Cree su contraseña que siga las siguientes condiciones: ")
print(" * Debe tener entre 8 y 16 caracteres.")
print(" * Debe tener al menos un dígito.")
print(" * Debe tener al menos una minúscula y una mayúscula.")

password = input("ingrese la clave a encriptar: ")
while not validate_password(password):
    print("La contraseña no cumple con los criterios. Inténtelo de nuevo.")
    password = input("Ingrese la clave a encriptar: ")

hashed_password = get_password_hash(password)
print(f"listo: {hashed_password}")