# OrderManagementSystem

Order Management System Demo API

## Main Modules

### Items Module

1. Create, Update, Delete and Get operations are implemented.

2. Image upload for items on creation

3. Get list of items as paginated, ordered and filtered list based on provided criteria.

### Users Module

1. Implemented CRUD operations

2. User registration with specific role or list of roles. By default, user is created with `Customer` role if roles are provided from the client.

3. Used the soft delete rather than permanently deleting.

And there are other modules implemented in similar way.

## Features and Technologies

1. MySQL database is used with EF Core in a code-first approach.

2. Clean Architecture is used following SOLID principles with CQRS.

3. Error handling with Fluent Validation and GlobalExceptionHandler implemented.

4. Used `IOptions` to get the configuration value. We may use 

5. Used the `IdentityUser` and `IdentityRole` to take advantage of primarily implemented user identity operations

6. Used `ILogger` for logging some information and errors.

7. Used `IFormFile` for image upload and saved in the local folder. We may require to use `Base64` string if we are forced to use only `json` format of the request.

8. Used the `Mapster` package for object mapping.

## Testing

1. Unit test is added to test application layer for user registration validity. And we could add for others too in similar way.

2. Additionally use Swagger UI or Scalar to test the APIs manually. To use Scalar instead of Swagger for testing, uncomment the `builder.Services.AddOpenApi();` and
`app.MapOpenApi(); app.MapScalarApiReference();`

## How to Run

```bash
dotnet restore # downloads all packages

dotnet ef migrations add MigrationName --startup-project api\OrderMs.Api --project api\OrderMS.Infrastructure

dotnet ef database update --startup-project api\OrderMs.Api --project api\OrderMS.Infrastructure

```

Before running these commands, you need to configure your connection string to database.

### The UI is not working for now. Use Swagger UI or Scalar
