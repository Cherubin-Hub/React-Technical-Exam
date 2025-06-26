
# 🧑‍💼 Employee Portal - Full Stack Application

This is a full-stack **Employee Management System** built using:

- 🔧 **ASP.NET Core Web API** for backend (C#)
- ⚛️ **React** for frontend
- 🗄️ **SQL Server** with stored procedures for database operations
- 📦 Entity Framework Core

---

## 📁 Project Structure

```
employee-portal/
├── backend/                # ASP.NET Core Web API
│   └── Controllers/
│   └── Models/
│   └── Database/
│   └── appsettings.json
│   └── Program.cs
│   └── ...
├── frontend/               # React Application
│   └── src/
│   └── public/
│   └── package.json
│   └── ...
```

---

## ⚙️ Prerequisites

Before running this project, install the following:

- [.NET SDK 8.0+](https://dotnet.microsoft.com/en-us/download)
- [Node.js + npm](https://nodejs.org/)
- [SQL Server (Express or LocalDB)](https://www.microsoft.com/en-us/sql-server)
- [Git](https://git-scm.com/)
- Visual Studio & SSMS

---

## 🗄️ SQL Database Setup

1. **Create a database manually** in SQL Server (e.g. `EmployeeDB`)
2. Execute the following **Stored Procedures** in the DB:

```sql
-- AddEmployee
CREATE PROCEDURE AddEmployee
    @Name NVARCHAR(100),
    @Email NVARCHAR(100),
    @Phone NVARCHAR(13),
    @Salary DECIMAL(18,2)
AS
BEGIN
    DECLARE @NewId UNIQUEIDENTIFIER = NEWID();

    INSERT INTO Employees (Id, Name, Email, Phone, Salary)
    VALUES (@NewId, @Name, @Email, @Phone, @Salary);

    SELECT * FROM Employees WHERE Id = @NewId;
END

-- UpdateEmployee
CREATE PROCEDURE UpdateEmployee
    @Id UNIQUEIDENTIFIER,
    @Name NVARCHAR(100),
    @Email NVARCHAR(100),
    @Phone NVARCHAR(13),
    @Salary DECIMAL(18,2)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Employees WHERE Id = @Id)
    BEGIN
        UPDATE Employees
        SET Name = @Name,
            Email = @Email,
            Phone = @Phone,
            Salary = @Salary
        WHERE Id = @Id;

        SELECT * FROM Employees WHERE Id = @Id;
    END
    ELSE
    BEGIN
        RAISERROR('Employee not found.', 16, 1);
    END
END

-- DeleteEmployee
CREATE PROCEDURE DeleteEmployee
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Employees WHERE Id = @Id)
    BEGIN
        DELETE FROM Employees
        WHERE Id = @Id;
    END
    ELSE
    BEGIN
        RAISERROR('Employee not found.', 16, 1);
    END
END

-- ViewEmployee
CREATE PROCEDURE ViewEmployee
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT *
    FROM Employees
    WHERE Id = @Id;
END

-- GetAllEmployees
CREATE PROCEDURE GetAllEmployees
AS
BEGIN
    SELECT * FROM Employees;
END
```

---

## 🔌 Backend (C# ASP.NET Core API)

### ⚙️ Setup

Update your connection string in `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=EmployeeDB;Trusted_Connection=True;"
}
```

> Replace `localhost` with your server name if needed.

### ▶️ Run the API

```
dotnet restore
dotnet run
```

### ✅ API will be hosted at:

```
https://localhost:7168/api/Employees
```

### 🧪 Sample Endpoints

- `GET /api/Employees/GetAllEmployees`
- `GET /api/Employees/ViewEmployee/{id}`
- `POST /api/Employees/AddEmployee`
- `PUT /api/Employees/UpdateEmployee/{id}`
- `DELETE /api/Employees/DeleteEmployee/{id}`

---

## ⚛️ Frontend (React App)

### ⚙️ Setup

```
npm install
```

### ▶️ Run the React App

```
npm start
```

> App runs at `http://localhost:3000` and communicates with the API at `https://localhost:7168`.
