// DTO for user registration
class UserRegisterDTO {
    constructor(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
    }
}

// DTO for user login
class UserLoginDTO {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}

// DTO for user profile
class UserDTO {
    constructor(email, username, watchlistCount = 0, friends = []) {
        this.email = email;
        this.username = username;
        this.watchlistCount = watchlistCount;
        this.friends = friends;
    }

    static toResponse(user, watchlistCount = 0) {
        return new UserDTO(user.email, user.username, watchlistCount, user.friends || []);
    }
}


module.exports = {
    UserRegisterDTO,
    UserLoginDTO,
    UserDTO
};