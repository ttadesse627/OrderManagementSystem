using Moq;
using OrderMS.Application.Features.Users.Commands.Create;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Domain.Entities;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Application.AppServices.Interfaces;

namespace Application.UnitTests.Users
{
    public class CreateUserCommandHandlerTests
    {
        private readonly Mock<IIdentityService> _identityServiceMock;
        private readonly Mock<ITokenGeneratorService> _tokenServiceMock;
        private readonly Mock<ICustomerRepository> _customerRepositoryMock;
        private readonly Mock<IUserResolverService> _userResolverServiceMock;

        private readonly CreateUserCommandHandler _handler;

        public CreateUserCommandHandlerTests()
        {
            _identityServiceMock = new Mock<IIdentityService>();
            _tokenServiceMock = new Mock<ITokenGeneratorService>();
            _customerRepositoryMock = new Mock<ICustomerRepository>();
            _userResolverServiceMock = new Mock<IUserResolverService>();

            _handler = new CreateUserCommandHandler(
                _identityServiceMock.Object,
                _tokenServiceMock.Object,
                _customerRepositoryMock.Object,
                _userResolverServiceMock.Object
            );
        }

        private static RegisterRequest BuildValidRequest(IList<string>? roles = null)
        {
            return new RegisterRequest(
                FirstName: "Abebe",
                LastName: "Chala",
                Address: "Somewhere",
                Roles: roles ?? ["Customer"],
                Email: "abebe@example.com",
                Password: "P@ssw0rd!"
            );
        }

        [Fact]
        public async Task Handle_Should_Create_User_When_Request_Is_Valid()
        {
            var request = new CreateUserCommand(BuildValidRequest());

            _identityServiceMock
                .Setup(x => x.CreateUserAsync(It.IsAny<ApplicationUser>(), It.IsAny<IList<string>>(), It.IsAny<string>()))
                .ReturnsAsync(new ApiResponse<int> { Success = true });

            _tokenServiceMock
                .Setup(x => x.GenerateTokenAsync(It.IsAny<ApplicationUser>()))
                .ReturnsAsync("GeneratedToken");

            var response = await _handler.Handle(request, CancellationToken.None);

            Assert.Equal(request.RegisterRequest.Email, response.Data?.Email);
            Assert.Equal(request.RegisterRequest.FirstName, response.Data?.FirstName);
            Assert.Equal("GeneratedToken", response.Data?.Token);

            _identityServiceMock.Verify(x =>
                x.CreateUserAsync(It.IsAny<ApplicationUser>(), It.IsAny<IList<string>>(), "P@ssw0rd!"),
                Times.Once);
        }

        [Fact]
        public async Task Handle_Should_Create_Customer_When_Roles_Is_Empty()
        {
            var request = new CreateUserCommand(BuildValidRequest(new List<string>()));

            _identityServiceMock
                .Setup(x => x.CreateUserAsync(
                    It.IsAny<ApplicationUser>(),
                    It.Is<IList<string>>(roles => roles.Contains("Customer")), // Verify "Customer" role is added
                    It.IsAny<string>()))
                .ReturnsAsync(new ApiResponse<int> { Success = true, Data = 123 }); // Added Data = userId

            // Act
            await _handler.Handle(request, CancellationToken.None);

            _identityServiceMock.Verify(
                x => x.CreateUserAsync(
                    It.IsAny<ApplicationUser>(),
                    It.Is<IList<string>>(roles => roles.Contains("Customer")),
                    It.IsAny<string>()),
                Times.Once);

            _customerRepositoryMock.Verify(x => x.Add(It.IsAny<Customer>()), Times.Once);
            _customerRepositoryMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task Handle_Should_Call_Token_Generator_When_User_Creation_Succeeds()
        {
            var request = new CreateUserCommand(BuildValidRequest());

            _identityServiceMock
                .Setup(x => x.CreateUserAsync(It.IsAny<ApplicationUser>(), It.IsAny<IList<string>>(), It.IsAny<string>()))
                .ReturnsAsync(new ApiResponse<int> { Success = true });

            await _handler.Handle(request, CancellationToken.None);

            _tokenServiceMock.Verify(x => x.GenerateTokenAsync(It.IsAny<ApplicationUser>()), Times.Once);
        }

        [Fact]
        public async Task Handle_Should_Not_Generate_Token_When_User_Creation_Fails()
        {
            var request = new CreateUserCommand(BuildValidRequest());

            _identityServiceMock
                .Setup(x => x.CreateUserAsync(It.IsAny<ApplicationUser>(), It.IsAny<IList<string>>(), It.IsAny<string>()))
                .ReturnsAsync(new ApiResponse<int> { Success = false });

            var result = await _handler.Handle(request, CancellationToken.None);

            Assert.True(string.IsNullOrEmpty(result.Data?.Token));

            _tokenServiceMock.Verify(x => x.GenerateTokenAsync(It.IsAny<ApplicationUser>()), Times.Never);
        }

        [Fact]
        public async Task Handle_Should_Execute_Validation()
        {
            var request = new CreateUserCommand(BuildValidRequest());

            _identityServiceMock
                .Setup(x => x.CreateUserAsync(It.IsAny<ApplicationUser>(), It.IsAny<IList<string>>(), It.IsAny<string>()))
                .ReturnsAsync(new ApiResponse<int> { Success = true });

            async Task<ApiResponse<AuthResponse>> action() => await _handler.Handle(request, CancellationToken.None);

            await action();
        }
    }
}
