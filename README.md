# Proyecto Laravel

Este proyecto está desarrollado con Laravel 11.

## 🚀 Requisitos

Asegúrate de tener instalado lo siguiente:

* PHP >= 8.2
* Composer
* Node.js y npm
* MySQL o MariaDB (u otro motor compatible)
* \[Opcional] Laravel Herd o Laravel Sail para un entorno más sencillo

---

## 📆 Instalación del proyecto

Sigue los siguientes pasos para levantar el proyecto en tu máquina local:

### 1. Clonar el repositorio

```bash
git clone https://github.com/usuario/nombre-del-repo.git
cd nombre-del-repo
```

### 2. Instalar dependencias de PHP

```bash
composer install
```

### 3. Instalar dependencias de JavaScript (si aplica)

```bash
npm install
```

### 4. Copiar y configurar el archivo `.env`

```bash
cp .env.example .env
```

Luego edita el archivo `.env` con tu configuración local, especialmente:

* `DB_DATABASE`
* `DB_USERNAME`
* `DB_PASSWORD`

### 5. Generar la clave de la aplicación

```bash
php artisan key:generate
```

### 6. Ejecutar migraciones (y seeders si existen)

```bash
php artisan migrate
# Opcional
php artisan db:seed
```

### 7. Compilar los assets (Vite)

```bash
npm run dev    # Desarrollo
# o
npm run build  # Producción
```

### 8. Levantar el servidor

```bash
php artisan serve
```

Abre en tu navegador: [http://localhost:8000](http://localhost:8000)

---

## 🛡️ Notas adicionales

* El archivo `.env` no está incluido en el repositorio por seguridad.
* La carpeta `vendor/` y `node_modules/` también están excluidas por ser generadas automáticamente.
* Si tienes errores, asegúrate de tener las versiones correctas de PHP, Node y Composer.

---

## 🧑‍💻 Autores

* [Stiven Arguello Jimenez]()

---

## 📝 Licencia

Este proyecto está licenciado bajo [MIT](LICENSE).


