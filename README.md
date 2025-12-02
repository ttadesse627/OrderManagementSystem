# OrderManagementSystem

Order Management System used for showcasing .NET skills



## Main Modules

### Items Module

1. Create, Update, Delete and Get operations are implemented.

2. Image upload for items on creation

3. Get list of items as paginated, ordered and filtered list based on provided criteria.

### Users Module

1. Implemented CRUD operations

2. User registration with specific role or list of roles. By default, user is created with `Customer` role if roles are provided from the client.

3. Used the soft delete rather than permanently deleting.


## Features and Technologies

1. MySQL database is used with EF Core in a code-first approach.

2. Clean Architecture is used following SOLID principles with CQRS.

3. Error handling with Fluent Validation and GlobalExceptionHandler implemented.


## Testing 

1. Unit test is added to test application layer for user registration validity.

2. Additionally use Swagger UI or Scalar to test the APIs manually.
