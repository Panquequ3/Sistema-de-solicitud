# INSTRUCCIONES

Para ingresar un administrador al sistema debe de ingresar a **ingresa_usuario.py**, abrir una terminal en la carpeta donde esté el archivo .py y active el ambiente virtual con:

```bash
venv\Scripts\activate (En windows)

source venv/bin/activate (Unix)
```

una vez activado el ambiente podrá visualizar algo como esto al inicio de la línea en la terminal:

```
(venv) C:\direccion\carpeta>
```

una vez hecho, podrá ejecutarlo con:
```bash
python ingresa_usuario.py
```

Ingrese la información que se le solicite, y ya estará listo.

**Observación:** una vez ingresada la información verá un error sobre el modulo 'bcrypt', este debe ser ignorado ya que es un error o advertencia del modulo por un atributo que ya no está en las nuevas versiones, más no es un error del programa ejecutado.